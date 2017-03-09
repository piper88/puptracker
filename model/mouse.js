'use strict';

const mongoose = require('mongoose');

const mouseSchema = mongoose.Schema({
  name: {type: String},
  //want genetic makeup to be an array, push each into array
  geneticMakeup: {type: Array, required: true},
  gender: {type: String, required: true},
  DOB: {type: Date, required: true},
  cageId: {type: mongoose.Schema.Types.ObjectId, required: true},
  lineId: {type: mongoose.Schema.Types.ObjectId, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('mouse', mouseSchema);
