'use strict';


const mongoose = require('mongoose');
const debug = require('debug')('puptracker:line');

//the projectSchema has an array of lines, that is of type Schema, and has a ref of 'line'. So then it goes to the line schema, and makes the lines, giving them the corresponding project?
const lineSchema = mongoose.Schema({
  name: {type: String, required: true},
  projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
  cages: [{type: mongoose.Schema.Types.ObjectId, ref: 'cage'}]
});

const Line = module.exports = mongoose.model('line', lineSchema);

//you're actually going to save the cage, in the cage POST route
Line.findLineByIdAndAddCage = function(lineId, cage) {
  return Line.findById(lineId)
  .then((line) => {
    //add the cage to the line's cages array
    line.cages.push(cage._id)
    //but don't actually save the cage here, just add it to the line
    return line.save();
  })
  .then(line => {
    return line;
  });
};

Line.findLineByIdAndRemoveCage = function(lineId, cage){
  debug('find line by id and remove cage');

  return Cage.findByIdAndRemove(cage._id)
  .then(() => {
    return Line.findById(lineId)
  })
  .then(line => {
    //find where the cage is in the line's cages array, and then splice it out
    let index = line.cages.indexOf(cage._id);
    line.cages.splice(index, 1)
    return line.save();
  });
};

Line.findLineByIdAndRemoveLine = function(lineId) {
  debug('find line by id and remove line')

  return Line.findById(lineId)
  .then((line) => {
    let removeChildren = [];
    line.cages.forEach(cage => {
      removeChildren.push(Cage.remove({lineId: line._id}));

      cage.mice.forEach(mouse => {
        removeChildren.push(Mouse.remove({cageId: cage._id}));
      });
    });
    return Promise.all(removeChildren);
  })
  .then(() => {
    return Line.findByIdAndRemove(lineId);
  };
});
