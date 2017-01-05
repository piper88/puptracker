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
  line.projectID = req.params.projID;
  Project.findById(req.params.projID)
  .then(project => {
    new Line(req.body).save()
    .then(line => {
      Project.findByIdAndAddLine(req.params.projID, line)
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

lineRouter.get('/api/project/:projID/line/:lineID', function(req, res, next){
  debug('GET /api/project/:id/line/:id');

  Line.findByID(req.params.lineID)
  .then(line => {
    res.json(line);
  })
  .catch(err => next(createError(404, err. message)));
});

lineRouter.delete('/api/project/:projID/line/:lineID', bearerAuth, function(req, res, next){
  debug('DELETE /api/project/:projID/line/:lineID');

  Line.findByID(req.params.lineID)
  .catch(err => {
    return err.status ? Promise.reject(err) : Promise.reject(createError(404, err.message))
  })
  .then(line => {
    Line.findByIDAndRemoveLine(line._id)
  })
  .then(() => {
    Project.findByIdAndRemoveLine(req.params.projID, req.params.lineID);
  })
  .catch(() => res.status(204).send())
  .catch(next);
  });
