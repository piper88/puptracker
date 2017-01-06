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
  breedingEndDate: {type: Date, required: true},
  expectedDOB: {type: Date, required, true},
  actualDOB: {type: Date},
  numberLittersMonthly: {type: Number},
  expectedTotalPups: {type: Number},
  actualTotalPups: {type: Number},
  expectedUsablePups: {type: Number},
  actualUsablePups: {type: Number},
  //calculated from the array of genes
  expectedPercentUsableProgeny: {type: Number, required: true},
  //will be calculated on front-end, just actual usable/actual total?
  // actualPercentUsableProgeny
});


//to calculate the pups in the line's property, have static method here that calculates it, and then sets the corresponding line's property to that value...
