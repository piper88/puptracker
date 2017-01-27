'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:project-router');

const User = require('../model/user.js');
const Project = require('../model/project.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const projectRouter = module.exports = Router();

projectRouter.post('/api/project', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/artist');
  req.body.userID = req.user._id;
  User.findById(req.user._id)
    .then( project => res.json(project))
    .catch(next);
});

projectRouter.get('/api/project/:projectID', function(req, res, next) {
  debug('GET /api/project/:projectID');
  Project.findById(req.params.projectID)
  .populate({path: 'lines'})
  .then( project => {
    res.json(project);
  })
  .catch( err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

projectRouter.put('/api/project/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT /api/project/:id');

  Project.findById(req.params.id)
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

projectRouter.delete('/api/project/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/project/:id');
  Project.findById(req.params.id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(project => {
    if (project.userId.toString() !== req.user._id.toString()) return Promise.reject(createError(401, 'unauthorized request'));
    return Project.findByIdAndRemoveProject(project._id);
  })
  .catch(err => {
    return Promise.reject(err.status ? err : createError(404, err.message));
  })
  .then(() => res.status(204).send())
  .catch(next);
});
