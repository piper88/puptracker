'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('puptracker:cage');

const Mouse = require('./mouse.js');

// Initial User Inputs - `name`, `breedingStart`
// Update User Inputs - `actualDOB`
//
// `breedingEnd`
//   - Calculated: Set end date for when youngest breeder in cage is 200 days old
// `expectedDOB`
//   - Calculated. 22 days after Breeding Start Date
// `actualDOB`
//   - Entered by user after litter is physically born. Will then reset "Breeding Start Date" so the subsequent litter in that cage will have an "Expected DOB" 22 days from then
// `Number of Litters per month`
//   - Calculated using Expected DOB
// `expectedTotalPups`
//   - Set by default to 6 per breeding female (can have more than 1 breeding female in a cage)
// `expectedUsablePups`
//   - Calculated by # of breeding females in the cage x litter size (6) per female in the cage x Usable %
//   - Usable % will be determined by genotype of male and female(s)

const cageSchema = mongoose.Schema({
  name: {type: String, required:true},
  numberOfFemales: {type: Number},
  numberOfMales: {type: Number},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  lineId: {type: mongoose.Schema.Types.ObjectId, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
  mice: [{type: mongoose.Schema.Types.ObjectId, ref: 'mouse'}],

  breedingStartDate: {type: Date},
  breedingEndDate: {type: Date},  //end date will be calculated as when youngest mouse breeder is 200 days old
  actualDOB: {type: Date},
  //should calculate, on average 25 days after putting in cage together, should eventually have an option for min and max days
  numberLittersMonthly: {type: Number},
  numberPupsBorn: {type: Number},
  expectedPercentUsableProgeny: {type: Number},
});

const Cage = module.exports = mongoose.model('cage', cageSchema);

Cage.findCageByIdAndAddMouse = function(cageId, mouse) {
  debug('find cage by id and add mouse');
  return Cage.findById(cageId)
  .then((cage) => {
    cage.mice.push(mouse._id);
    return cage.save();
  });
};

Cage.findCageByIdAndRemoveMouse = function(cageId, mouse) {
  debug('find cage by id and remove mouse');
  return Cage.findById(cageId)
  .then((cage) => {
    let index = cage.mice.indexOf(mouse._id);
    cage.mice.splice(index, 1);
    return cage.save();
  });
};

Cage.findCageByIdAndRemoveCage = function(cageId) {
  debug('find cage by id and remove cage');
  return Cage.findById(cageId)
    .then(() => Mouse.remove({cageId:cageId}))
    .then(() => Cage.findByIdAndRemove(cageId));
};
