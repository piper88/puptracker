'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('puptracker:project');

const Line = require('./line.js');
const Cage = require('./cage.js');
const Mouse = require('./mouse.js');

const projectSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  lines: [{type: mongoose.Schema.Types.ObjectId, ref: 'line'}],
  //probably won't be a userId? will just have get routes not use bearer auth middleware, so anyone can GET
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
});

const Project = module.exports = mongoose.model('project', projectSchema);

Project.findByIdAndAddLine = function(projId, line){
  debug('Project: findByIdAndAddLine');

  return Project.findById(projId)
  .then(project => {
    project.lines.push(line._id);
    debug('!!!!!!!!!!!THE PROJECT WITH THE LINE HOPEFULLY ADDED', project);
    return project.save();
  });
};

//this method just needs to handle removing the line in relation to the project. You actually remove all the children of the line in the Line.findLineByIdAndRemoveLine method
Project.findByIdAndRemoveLine = function(projectId,lineId) {
  debug('Project: findbyIdAndRemoveLine');
  //find the project
  return Project.findById(projectId)
  //if you find a project
  .then(project => {
    //delete the line from the project.lines array
    let index = project.lines.indexOf(lineId);
    project.lines.splice(index, 1);
    return project.save();
  });
};

//remove all the lines, cages, and mice with the projectId, and then remove the project itself
Project.findByIdAndRemoveProject = function(projectId) {
  debug('Project: findByIdAndRemoveProject');
  return Project.findById(projectId)
  .then(() => Line.remove({projId:projectId}))
  .then(() => Cage.remove({projId:projectId}))
  .then(() => Mouse.remove({projId:projectId}))
  .then(() => Project.findByIdAndRemove(projectId));
};
