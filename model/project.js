'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('puptracker:project');

const Line = require('./line.js');

const projectSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  lines: [{type: mongoose.Schema.Types.ObjectId, ref: 'line'}],
  //probably won't be a userID? will just have get routes not use bearer auth middleware, so anyone can GET
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

const Project = module.exports = mongoose.model('project', projectSchema);

Project.findByIdAndAddLine = function(projID, line){
  debug('Project: findByIDAndAddLine');

  return Project.findById(id)
  .then(project => {
    project.lines.push(line._id);
    return project.save();
  });
};

//find a project by the projectID, and add a line to that project
//add line to lines array, and then save that project
//save that line
// Project.findByIdAndAddLine = function(id, line){
//   debug('Project: findByIDAndAddLine');
//   //Find the Project
//   return Project.findById(id)
//   //if you find a project, then create the line
//   .then(project => {
//     //the projectID of the line is set to the id give to the line by mongoose
//     line.projectID = project._id;
//     //create a tempProject for testing purposes I think?
//     this.tempProject = project;
//     //maybe you want to actually save the line in the line.POSt route
//     return new Line(line).save();
//   })
//   .then((line) => {
//     //every time you make a new line, push the line into the project array
//     this.tempProject.lines.push(line._id);
//     this.tempLine = line;
//     return this.tempProject.save();
//   })
//   .then(() => {
//     //so the new line is what is returned
//     return this.tempLine;
//   })
// };

//have to do more in this method????? or not?
//have to remove the line from the lines array on the project
//have to save the updated project, without the just-removed line
Project.findByIdAndRemoveLine = function(projectID,lineID) {
  debug('Project: findbyIDAndRemoveLine');
  //find the project
  return Project.findById(projectID)
  //if you find a project
  .then(project => {
    //delete the line from the project.lines array
    let index = project.lines.indexOf(lineID);
    project.lines.splice(index, 1);
    return project.save();
  })
  //you will do this stuff in the line.delete route
  // .then(() => {
  //   //a built in mongoose method, not one of the ones I created
  //   return Line.findByIDAndRemove(lineID)
  // })
  // .then(() => {
  //   console.log('I have no idea what Im doing but its fine');
  // });
};

//in this, you just have to recursively delete all cages from the line, and maybe even all mice from the cages
Project.findByIdAndRemoveProject = function(projectID){
  debug('Project: findByIDAndRemoveProject');
  //find the project
  //remove the project
  //remove all lines from project
  //remvove all cages from lines
  //remove all mice from cages

  return Project.findById(projectID)
  .then(project => {
    //first remove all the children of the project: includes the cages and mice, and later you will actually delete the line. Have to start at the end and move backwards: delete the actual line and then project very last
    let removeChildren = [];
    project.lines.forEach(line => {
      //remove the cage with the lineID
      removeChildren.push(Cage.remove({lineID:line._id}));
      //is the line going to have an array of mice?
      line.miceArray.forEach(lineID => {
        removeChildren.push(Mouse.remove({_id:lineID}));
      });
    });
    return Promise.all(removeChildren);
  })
  .then(() => {
    //then remove the line, that has the projectID of the projectID that you are deleting
    return Line.remove({projectID: projectID})
  })
  .then(() => {
    //then remove the project
    return Project.findByIdAndRemove(projectID);
  });
};
