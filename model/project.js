'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('puptracker:project');

const projectSchema = mongoose.Schema({
  name: {type: String, required:true},
  lines: [{type: mongoose.Schema.Types.ObjectId, ref: 'line'}],
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

const Project = module.exports = mongoose.model('project', projectSchema);

Project.findByIdAndAddLine = function(projId, line){
  debug('Project: findByIdAndAddLine');
  return Project.findById(projId)
  .then(project => {
    project.lines.push(line._id);
    return project.save();
  });
};

//this method just needs to handle removing the line in relation to the project. You actually remove all the children of the line in the Line.findLineByIdAndRemoveLine method
Project.findByIdAndRemoveLine = function(projectId,lineId) {
  debug('Project: findbyIdAndRemoveLine');
  // Find the project
  return Project.findById(projectId)
  .then(project => {
    //delete the line from the project.lines array
    let index = project.lines.indexOf(lineId);
    project.lines.splice(index, 1);
    return project.save();
  });
};
