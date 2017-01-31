'use strict';


const mongoose = require('mongoose');
const debug = require('debug')('puptracker:line');

const Cage = require('./cage.js');
const Mouse = require('./mouse.js');

const lineSchema = mongoose.Schema({
  name: {type: String, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
  cages: [{type: mongoose.Schema.Types.ObjectId, ref: 'cage'}],
  genes: {type: Array, required: true},
  expectedTotalPups: {type: Number},
  actualTotalPups: {type: Number},
  expectedUsablePups: {type: Number},
  actualUsablePups: {type: Number},
});

const Line = module.exports = mongoose.model('line', lineSchema);

//you're actually going to save the cage, in the cage POST route
//these methods just handle the saving and removing in relation to the LINE
Line.findLineByIdAndAddCage = function(lineId, cage) {
  return Line.findById(lineId)
  .then((line) => {
    //add the cage to the line's cages array
    line.cages.push(cage._id);
    //but don't actually save the cage here, just add it to the line
    return line.save();
  });
};

//remove the cage from the lines cage array. Will actually delete the cage in the cages delete route
Line.findLineByIdAndRemoveCage = function(lineId, cage){
  debug('find line by id and remove cage');

  return Line.findById(lineId)
  .then(line => {
    let index = line.cages.indexOf(cage._id);
    line.cages.splice(index, 1);
    return line.save();
  });
};

Line.findLineByIdAndRemoveLine = function(lineId) {
  debug('find line by id and remove line');

  return Line.findById(lineId)
  .then(() => Cage.remove({lineId:lineId}))
  .then(() => Mouse.remove({lineId:lineId}))
  .then(() => Line.findByIdAndRemove(lineId));
};
