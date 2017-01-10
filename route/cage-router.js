'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:cage-router')

const Line = require('../model/line.js');
const Cage = require('../model/cage.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const cageRouter = module.exports = Router();

cageRouter.post('/api/project/:projId/line/:lineId/cage', bearerAuth, jsonParser, function(req, res, next) {
  if (!req.body) return Promise.reject(createError(400,
  'no body'));

  let cage = req.body;
  //set the lineId of the cage to the req.params.lineId
  cage.lineId = req.params.lineId;
  cage.projectId = req.params.projId;
  Line.findById(req.params.lineId)
  .then((line) => {
    new Cage(req.body).save()
    .then((cage) => {
      Line.findLineByIdAndAddCage(req.params.lineId, cage)
      .then((line) => {
        //don't know if we need this line?
        req.line = line;
        res.json(cage);
      });
    })
    .catch(err => next(err));
  })
  .catch(err => next(createError(404, err.message)));
});
