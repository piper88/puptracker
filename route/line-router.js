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

lineRouter.post('/api/project/:projId/line', bearerAuth, jsonParser, function(req, res, next){
debug('POST /api/project/:id/line');

  if (!req.body) return Promise.reject(createError(400, 'no body'));
  let line = req.body
  //set the project id of the line, to the req.params.id
  line.projectId = req.params.projId;
  Project.findById(req.params.projId)
  .then((project) => {
    debug('this is the project that youre adding the line to', project);
    new Line(req.body).save()
    .then(line => {
      Project.findByIdAndAddLine(req.params.projId, line)
      .then(project => {
        //what's the purpose of this line?
        req.project = project;
        res.json(line);
      });
    })
    .catch(err => next(err));
  })
  .catch(err => next(createError(404, err.message)));
});

lineRouter.get('/api/project/:projId/line/:lineId', function(req, res, next){
  debug('GET /api/project/:id/line/:id');

//not sure if we need this error handling, but how else do we catch the error if the project isn't found?
  Project.findById(req.params.projId)
  .then(() => {
    Line.findById(req.params.lineId)
    .then(line => {
      res.json(line);
    })
    .catch(err => next(createError(404, err.message)))
  })
  .catch(err => next(createError(404, err.message)));
});

lineRouter.delete('/api/project/:projId/line/:lineId', bearerAuth, function(req, res, next){
  debug('DELETE /api/project/:projId/line/:lineId');

  Line.findById(req.params.lineId)
  .catch(err => {
    return err.status ? Promise.reject(err) : Promise.reject(createError(404, err.message))
  })
  .then(line => {
    Line.findByIdAndRemoveLine(line._id)
  })
  .then(() => {
    Project.findByIdAndRemoveLine(req.params.projId, req.params.lineId);
  })
  .catch(() => res.status(204).send())
  .catch(next);
  });
