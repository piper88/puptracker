'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('puptracker:project');

const projectSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  lines: [{type: mongoose.Schema.Types.ObjectId, ref:'line'}],
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

const Project = module.exports = mongoose.model('project', projectSchema);

Project.findByIdAndAddLine = function(id, line){
  debug('Project: findByIdAndAddLine');
  return Project.findById(id)
  .then(project => {
    project.lines.push(line._id);
    return project.save();
  });
};

Project.findByIdAndRemoveLine = function(projectId,lineId) {
  debug('Project: findbyIdAndRemoveLine');
  return Project.findById(projectId)
  .then(project => {
    if (project.lines.length) {
      let index = project.lines.indexOf(lineId);
      project.lines.splice(index, 1);
      return project.save();
    }
  });
};

Project.findByIdAndRemoveProject = function(projectId){
  debug('Project: findByIdAndRemoveProject');
  //find the project
  //remove the project
  //remove all lines from project
  //remvove all cages from lines
  //remove all mice from cages

  return Project.findById(projectId)
  .then(project => {
    let removeChildren = [];
    project.lines.forEach(line => {
      //remove the cage with the lineID
      removeChildren.push(Cage.remove({lineID:line._id}));
      //is the line going to have an array of mice?
      line.miceArray.forEach(lineID => {
        removeChildren.push(Mouse.remove({_id:lineID}));
      });
    });
    return Promsie.all(removeChildren);
  })
  .then(() => {
    //then remove the line
    return Line.remove({projectId:projectId});
  })
  .then(() => {
    //then remove the project
    return Project.findByIdAndRemove(projectId);
  });
};
