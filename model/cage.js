'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('puptracker:cage');

const Mouse = require('./mouse.js');

const cageSchema = mongoose.Schema({
  name: {type: String},
  numberOfFemales: {type: Number},
  numberOfMales: {type: Number},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  lineId: {type: mongoose.Schema.Types.ObjectId, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
  mice: [{type: mongoose.Schema.Types.ObjectId, ref: 'mouse'}],


  breedingStartDate: {type: Date},
  //end date will be calculated as when youngest mouse breeder is 200 days old
  breedingEndDate: {type: Date},
  expectedDOB: {type: Date},
  actualDOB: {type: Date},
  //should calculate, on average 25 days after putting in cage together, should eventually have an option for min and max days
  numberLittersMonthly: {type: Number},
  //calculated based on average litter size, when breeders were set up, and number of breeding females
  expectedTotalPups: {type: Number},
  actualTotalPups: {type: Number},
  //calculated from the genes of parents, and number of breeding females
  // expectedUsablePups: {type: Number, required: true},
  actualUsablePups: {type: Number},
  //calculated from the array of genes
  expectedPercentUsableProgeny: {type: Number},
  //will be calculated on front-end, just actual usable/actual total?
  // actualPercentUsableProgeny
});

const Cage = module.exports = mongoose.model('cage', cageSchema);


//to calculate the pups in the line's property, have static method here that calculates it, and then sets the corresponding line's property to that value...

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
