'use strict';

const mongoose = require('mongoose');

const mouseSchema = mongoose.Schema({
  name: {type: String},
  geneticMakeup: {type: String},
  DOB: {type: Date},
  cageId: {type: mongoose.Schema.Types.ObjectId, required: true},
  lineId: {type: mongoose.Schema.Types.ObjectId, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('mouse', mouseSchema);
