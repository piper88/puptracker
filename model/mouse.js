'use strict';

const mongoose = require('mongoose');

//mouseSchema should be breeders, not the pups
const mouseSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  //e.g. [het, homo, wild] will correspond to the array of genes in the line?
  geneticMakeup: {type: [String], required: true},
  cageId: {type: mongoose.Schema.Types.ObjectId, required: true},
  lineId: {type: mongoose.Schema.Types.ObjectId, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('mouse', mouseSchema);
