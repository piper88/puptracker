'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('puptracker:cage');

const cageSchema = mongoose.Schema({
  name: {type: String, required: true},
  numberOfMales: {type: Number, required: true},
  numberOfFemales: {type: Number, required: true},
  lineId: {type: mongoose.Schema.Types.ObjectId, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
  mice: [{type: mongoose.Schema.Types.ObjectId, ref: 'mouse'}],
  breedingStartDate: {type: Date, required: true},
  //end date will be calculated as when youngest mouse breeder is 200 days old
  breedingEndDate: {type: Date, required: true},
  expectedDOB: {type: Date, required: true},
  actualDOB: {type: Date},
  numberLittersMonthly: {type: Number, required: true},
  expectedTotalPups: {type: Number, required: true},
  actualTotalPups: {type: Number},
  //calculated from the ratio of genes of parents (from genes array)
  expectedUsablePups: {type: Number, required: true},
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
  // .then(cage => {
  //   return cage;
  // });
};

Cage.findCageByIdAndRemoveMouse = function(cageId, mouse) {
  debug('find cage by id and remove mouse');

  return Cage.findById(cageId)
  .then((cage) => {
    let index = cage.mice.indexOf(mouse._id);
    cage.mice.splice(index, 1);
    return cage.save();
  })
};

Cage.findCageByIdAndRemoveCage = function(cageId) {
  debug('find cage by id and remove cage');

  return Cage.findById(cageId)
  .then((cage) => {
    //remove all the mice from that cage
    let removeChildren = [];
    cage.mice.forEach(mouse => {
      removeChildren.push(Mouse.remove({cageId: cage._id}));
    });
    return Promise.all(removeChildren);
  })
  .then(() => {
    //then delete the cage itself
    return Cage.findByIdAndRemove(cageId);
  });
};
