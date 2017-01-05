'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:project-router');

const Project = require('../model/project.js');
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

//no bearerAuth because anyone can 'get' a project?
// projectRouter.get('/api/project/:id', bearerAuth, function(req, res, next) {
//   //have to also use populate to populate the project with the array of lines
//   debug('GET /api/project/:id');
//   //find the project by the id, and res.json it
//   Project.findById(req.params.id)
//   //MAYBEEE????????????????????
//   .then((project) => {
//     project.lines.forEach((line) => {
//       //how do we fetch the lines of the project? or do we just have the array of lines? And then when we need access to the lines themselves, we make a Line.findById or whatever
//     });
//   });
//   .populate('lines')
//   .catch(() => {
//     debug('ICH HOFFE DASS ICH DIESES NACHRICHT SEHEN');
//     return Promise.reject(createError(404, 'project not found'));
//   })
//   .then(project => {
//     // if (project.userId.toString() !== req.user._id.toString()) return Promise.reject(createError, 401, 'invalid userId');
//     res.json(project);
//   })
//   .catch(next);
// });

//get the project, is the array of lines already populated? I'm so confused
projectRouter.get('/api/project/:id', bearerAuth, function(req, res, next) {
  debug('GET /api/project/:id');
  Project.findById(req.params.id)
  .then((project) => {
    res.json(project);
  })
  .catch(err => next(createError(404, err.message)));
});

projectRouter.delete('/api/project/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/project/:id');
  //first find the project by the req.params._id
  //if there is none return a promise with a 404 not found error
  //if you do find the project, check to make sure the userId of the project matches the id of the user making the request
  //if they don't match, send 401 unauthorized error
  //if they do match, then Project.findByIdAndRemoveProject
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
