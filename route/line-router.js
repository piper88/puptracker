'use strict';

//here is where you will actually be saving the new line, and calling the Project.findByIdAndAddLine business, that is defined as methods on the models

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:line-router');

const Project = require('../model/project.js');
const Line = require('../model/line.js');
const Cage = require('../model/cage.js');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const lineRouter = module.exports = Router();

// Create a new line
//call Project.findByIdAdAddLine

lineRouter.post('/api/project/:projectId/line', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/project/:projectId/line');

  Project.findById(req.params.projectId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(project => {
    req.body.userId = req.user._id;
    req.body.projectId = project._id;

    new Line(req.body).save()
    .then(line => {
      Project.findByIdAndAddLine(req.params.projectId, line)
      .then(project => {
        debug('THE PROJECT WITH THE LINE ADDED', project);
        req.project = project;
        res.json(line);
      });
    })
    .catch(err => next(err));
  });
});

// Get a Line by its ID
lineRouter.get('/api/project/:projectId/line/:lineId', function(req, res, next){
  debug('GET /api/project/:projectId/line/:lineId');
  // Find line by id
  Line.findById(req.params.lineId)
  // return all the cages in the array on the lines model
  // Populate fills the arrays of ids with their corresponding schema info
  .populate({path: 'cages'})
  .then(line => {
    res.json(line);
  })
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

// Return all the lines - TODO: test
lineRouter.get('/api/project/:projectId/lines', function(req, res, next){
  debug('GET /api/project/:projectId/lines');
  // Find a line by its project ID
  Line.find({projectId: req.params.projectId})
  // populate cages from the array on the model
  .populate({path: 'cages'})
  .then(lines => res.json(lines))
  .catch(err => err.status ? next(err) : next(createError(404, 'no lines for this project')));
});

lineRouter.delete('/api/project/:projectId/line/:lineId', bearerAuth, function(req, res, next){
  debug('DELETE /api/project/:projectId/line/:lineId');
  // First find the line by Id
  Line.findById(req.params.lineId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then( line => {
    if(line.userId.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'invalid userid'));
    return Line.findByIdAndRemove(req.params.lineId);
  })
  .catch( err => Promise.reject(err))

  // remove all cages associated with the line
  .then( () => Cage.remove({ lineId: req.params.lineId}))
  .then( () => {
    Project.findById(req.params.projectId)
    .then( project => {
      project.lines.forEach( line => {
        if (project.lines[line] === req.params.lineId)
          project.lines.splice(project.lines.indexOf(line), 1);
      });
      return project.save();
    });
  })
  .then( () => res.sendStatus(204))
  .catch(next);
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
    res.json(line);
  })
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    if (err.status) return next(err);
    next(createError(404, err.message));
  });
});
