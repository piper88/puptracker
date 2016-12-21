'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:project-router');

const Project = require('../model/project.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const projectRouter = module.exports = Router();

//route to add project

//route to delete project

//route to get project

projectRouter.post('/api/project', bearerAuth, jsonParser, function(req, res, next) {
  debug('OH BOY HERE IS THE DEBUG STATEMENT POST /api/project');
  if (!req.body) return Promise.reject(createError(400, 'no body'));
  let project = req.body;
  //set the userID of the project to the user making the request
  project.userId = req.user._id;
  debug('DAS PROJECT', project);
  return new Project(project).save()
  .then(result => res.json(result))
  .catch(next);
});

//no bearerAuth because anyone can 'get' a project?
projectRouter.get('/api/project/:id', function(req, res, next) {
  debug('GET /api/project/:id');
  //find the project by the id, and res.json it
  Project.findById(req.params.id)
  .catch(() => {
    return Promise.reject(createError(404, 'project not found'));
  })
  .then(project => {
    res.json(project);
  });
});

projectRouter.delete('/api/project/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/project/:id');
  //first find the project by the req.params._id
  //if there is none return a promise with a 404 not found error
  //if you do find the project, check to make sure the userID of the project matches the id of the user making the request
  //if they don't match, send 401 unauthorized error
  //if they do match, then Project.findByIdAndRemoveProject
  Project.findById(req.params.id)
  .catch(err => Promise.reject(createError(404, 'project not found')))
  .then(project => {
    if (project.userId.toString() !== req.user._id.toString()) return Promise.reject(createError(401, 'unauthorized request'));
    Project.findByIdAndRemoveProject(project._id);
  })
  .catch(err => {
    return Promise.reject(err.status ? err : createError(404, err.message));
  })
  .then(() => res.status(204).send())
  .catch(next);
});
