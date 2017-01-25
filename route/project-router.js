'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:project-router');

const Project = require('../model/project.js');
const Line = require('../model/line.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const projectRouter = module.exports = Router();

//I BELIEVE that the router just calls the methods, and does as little of the handling of the data as possible, and instead just calls methods on the models on the req, and sends the res along afterwards.

//route to add project

//route to delete project

//route to get project

projectRouter.post('/api/project', bearerAuth, jsonParser, function(req, res, next) {
  // debug('OH BOY HERE IS THE DEBUG STATEMENT POST /api/project');
  if (!req.body) return Promise.reject(createError(400, 'no body'));
  let project = req.body;
  //set the userId of the project to the user making the request
  project.userId = req.user._id;
  debug('DAS PROJECT', project);
  return new Project(project).save()
  .then(result => res.json(result))
  .catch(next);
});


//get the project, is the array of lines already populated? I'm so confused
projectRouter.get('/api/project/:id', function(req, res, next) {
  debug('GET /api/project/:id');
  Project.findById(req.params.id)
  .then((project) => {
    res.json(project);
  })
  .catch(err => next(createError(404, err.message)));
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
