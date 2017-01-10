'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:cage-router')

const Line = require('../model/line.js');
const Project = require('../model/project.js');
const Cage = require('../model/cage.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const cageRouter = module.exports = Router();

cageRouter.post('/api/project/:projId/line/:lineId/cage', bearerAuth, jsonParser, function(req, res, next) {
  if (!req.body) return Promise.reject(createError(400, 'no body'));

  let cage = req.body;

  Project.findById(req.params.projId)
  .then(() => {
    cage.projectId = req.params.projId;
    Line.findById(req.params.lineId)
    .then((line => {
      cage.lineId = req.params.lineId;
      new Cage(req.body).save()
      .then((cage) => {
        Line.findLineByIdAndAddCage(req.params.lineId, cage)
        .then((line => {
          req.line = line;
          res.json(cage);
        }));
        // .catch(err => next(err));
      })
        .catch(err => next(err));
      }))
      .catch(err => next(createError(404, err.message)));
    })
  .catch(err => next(createError(404, err.message)));
});
