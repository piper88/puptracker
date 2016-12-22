'use strict';


const mongoose = require('mongoose');
const debug = require('debug')('puptracker:line');

//the projectSchema has an array of lines, that is of type Schema, and has a ref of 'line'. So then it goes to the line schema, and makes the lines, giving them the corresponding project?
const lineSchema = mongoose.Schema({
  name: {type: String, required: true},
  projectID: {type: mongoose.Schema.Types.ObjectID, required: true},
  cages: [{type: mongoose.Schema.Types.ObjectID, ref: 'cage'}]
});

const Line = module.exports = mongoose.model('line', lineSchema);

//you're actually going to save the cage, in the cage POST route
Line.findLineByIDAndAddCage = function(lineID, cage) {
  return Line.findByID(lineID)
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

Line.findLineByIDAndRemoveCage = function(lineID, cage){
  debug('find line by id and remove cage');

  return Cage.findByIDAndRemove(cage._id)
  .then(() => {
    return Line.findByID(lineID)
  })
  .then(line => {
    //find where the cage is in the line's cages array, and then splice it out
    let index = line.cages.indexOf(cage._id);
    line.cages.splice(index, 1)
    return line.save();
  });
};

Line.findLineByIDAndRemoveLine = function(lineID) {
  debug('find line by id and remove line')

  return Line.findByID(lineID)
  .then((line) => {
    let removeChildren = [];
    line.cages.forEach(cage => {
      removeChildren.push(Cage.remove({lineID: line._id}));

      cage.mice.forEach(mouse => {
        removeChildren.push(Mouse.remove({cageID: cage._id}));
      });
    });
    return Promise.all(removeChildren);
  })
  .then(() => {
    return Line.findByIDAndRemove(lineID);
  };
});
