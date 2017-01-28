'use strict';

//here is where you will actually be saving the new line, and calling the Project.findByIdAndAddLine business, that is defined as methods on the models

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:line-router');

const Project = require('../model/project.js');
const Line = require('../model/line.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const lineRouter = module.exports = Router();

// Create a new line
lineRouter.post('/api/project/:projectId/line', bearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/project/:projectId/line');

  if (!req.body) return Promise.reject(createError(400, 'no body'));
  let tempProject, tempLine; // What is this purpose
  // Find the project by ID given in query
  Project.findById(req.params.projectId)
  // If this is incorrect, reject the promise and create error  .catch(err => Promise.reject(createError(404, err.message)))
  .catch(err => Promise.reject(createError(404, err.message)))
  // If this is correct, project is passed into then statement
  .then( project => {
    // If ID on the project doesn't match user Id, reject promise
    if (project.userId.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'invalid user'));
    tempProject = project;
    // Set the project and user ids on the line schema
    req.body.projectId = project._id;
    req.body.userId = req.user._id;
    // Save the new line with the information from the request body
    return new Line(req.body).save();
  })
  //  Line is passed in and its id is added to an array of ids
  // stored in the lines array on the project model
  .then (line => {
    tempLine = line;
    tempProject.lines.push(line._id);
    return tempLine.save();
  })
  // Th server responds with a copy of the line information
  // (stored in the variable tempLine)
  .then(() => res.json(tempLine))
  .catch(next);
});

// Get a Line by its ID
lineRouter.get('/api/line/:lineId', function(req, res, next){
  debug('GET /api/line/:lineId');
  // Find line by id
  Line.findById(req.params.lineId)
  // return all the cages in the array on the lines model
  // Populate fills the arrays of ids with their corresponding schema info
  .populate('cages')
  .then(line => {
    res.json(line);
  })
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

// Return all the lines - TODO: test
lineRouter.get('/api/project/:projId/lines', function(req, res, next){
  debug('GET /api/project/:id/lines');
  // Find a line by its project ID
  Line.find({projectId: req.params.projId})
  // populate cages from the array on the model
  .populate('cages')
  .then(lines => res.json(lines))
  .catch(err => err.status ? next(err) : next(createError(404, 'no lines for this project')));
});

lineRouter.delete('/api/project/:projId/line/:lineId', bearerAuth, function(req, res, next){
  debug('DELETE /api/project/:projId/line/:lineId');

  Project.findById(req.params.projId)
    .then(() => {
      Line.findById(req.params.lineId)
      .catch(err => next(createError(404, err.message)))
      .then(line => {
        Line.findLineByIdAndRemoveLine(line._id);
      })
      .then(() => {
        Project.findByIdAndRemoveLine(req.params.projId, req.params.lineId);
      })
      .then(() => res.status(204).send())
      .catch(next);
    })
  .catch(err => next(createError(404, err.message)));
});

//for putting, will also have to update the project's line array
lineRouter.put('/api/project/:projId/line/:lineId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/project/:projId/line/:lineId');

  Line.findById(req.params.lineId)
  .then((line) => {
    let options = {runValidators: true, new: true};
    return Line.findByIdAndUpdate(line._id, req.body, options);
  })
  .then(line => {
    console.log('THE NEW LINES ID', line._id);
    res.json(line);
  })
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    if (err.status) return next(err);
    next(createError(404, err.message));
  });
});
