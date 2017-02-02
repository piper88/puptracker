'use strict';

const mongoose = require('mongoose');

//mouseSchema should be breeders, not the pups
const mouseSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  //e.g. [het, homo, wild] will correspond to the array of genes in the line?...
  geneticMakeup: {type: [String], required: true},
  //also don't need DOB, because that is represented on the cage model
  DOB: {type: Date, required: true},
  //don't care about sex of pups, don't need to know anything about pups except how many there are
  sex: {type: String, required: true},
  cageId: {type: mongoose.Schema.Types.ObjectId, required: true},
  lineId: {type: mongoose.Schema.Types.ObjectId, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('mouse', mouseSchema);
