'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:project-router');

const User = require('../model/user.js');
const Line = require('../model/line.js');
const Project = require('../model/project.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const projectRouter = module.exports = Router();

projectRouter.post('/api/project', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/project');
  req.body.userId = req.user._id;
  User.findById(req.user._id)
  .then( user => {
    req.body.username = user.username;
    return new Project(req.body).save();
  })
  .then( project => res.json(project))
  .catch(next);
});

// Return all projects
projectRouter.get('/api/projects', bearerAuth, function(req, res, next){
  debug('GET /api/projects');
  Project.find()
  .populate('lines')
  .then(projects => res.json(projects))
  .catch(next);
});

// Return a specific project
projectRouter.get('/api/project/:projectId', function(req, res, next) {
  debug('GET /api/project/:projectId');
  Project.findById(req.params.projectId)
  .populate({path: 'lines'})
  .then( project => {
    res.json(project);
  })
  .catch( err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

projectRouter.put('/api/project/:projectId', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT /api/project/:projectId');

  Project.findById(req.params.projectId)
  .then((project) => {
    let options = {runValidators: true, new: true};
    return Project.findByIdAndUpdate(project._id, req.body, options);
  })
  .then(project => res.json(project))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    if (err.status) return next(err);
    next(createError(404, 'not found'));
  });
});

projectRouter.delete('/api/project/:projectId', bearerAuth, function(req, res, next) {
  debug('DELETE /api/project/:projectId');
  Project.findById(req.params.projectId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(project => {
    if (project.userId.toString() !== req.user._id.toString()) return Promise.reject(createError(401, 'unauthorized request'));
    return Project.findByIdAndRemove(req.params.projectId);
  })
  .catch( err => Promise.reject(err))
  .then( () => Line.remove({projectId: req.params.projectId}))
  .then( () => res.sendStatus(204))
  .catch(next);
});
