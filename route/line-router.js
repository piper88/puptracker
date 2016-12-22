'use strict';

//here is where you will actually be saving the new line, and calling the Project.findByIdAndAddLine business, that is defined as methods on the models

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:line-router');

const Line = require('../model/line.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const lineRouter = module.exports = Router();

lineRouter.post('/api/project/:projID/line', bearerAuth, jsonParser, function(req, res, next){
debug('POST /api/project/:id/line');

  if (!req.body) return Promise.reject(createError(400, 'no body'));
  let line = req.body
  //set the project id of the line, to the req.params.id
  line.projectId = req.params.projID;
  Project.findById(projID)
  .then(project => {
    new Line(req.body).save()
    .then(line => {
      Project.findByIdAndAddLine(req.params.projID, line)
      .then(project => {
        req.project = project;
        res.json(project);
      });
    })
    .catch(err => next(err));
  })
  .catch(err => next(createError(404, err.message)));
});
