'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:cage-router');

const Line = require('../model/line.js');
const Project = require('../model/project.js');
const Cage = require('../model/cage.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const cageRouter = module.exports = Router();

cageRouter.post('/api/project/:projId/line/:lineId/cage', bearerAuth, jsonParser, function(req, res, next) {
  debug('cage router POST');
  if (!req.body) return Promise.reject(createError(400, 'no body'));

  let cage = req.body;

  Project.findById(req.params.projId)
  .then(() => {
    cage.projectId = req.params.projId;
    Line.findById(req.params.lineId)
    .then(() => {
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
    })
      .catch(err => next(createError(404, err.message)));
  })
  .catch(err => next(createError(404, err.message)));
});

cageRouter.get('/api/project/:projId/line/:lineId/cage/:cageId', function(req, res, next) {
  debug('cage router GET');
  Project.findById(req.params.projId)
  .then(() => {
    Line.findById(req.params.lineId)
    .then(() => {
      Cage.findById(req.params.cageId)
      .then((cage) => {
        res.json(cage);
      })
      //are all of these necessary? or do we assume the project and line ids are correct?
      .catch(err => next(createError(404, err.message)));
    })
    .catch(err => next(createError(404, err.message)));
  })
  .catch(err => next(createError(404, err.message)));
});

cageRouter.delete('/api/project/:projId/line/:lineId/cage/:cageId', bearerAuth, function(req, res, next) {
  debug('cage router DELETE');
  Cage.findById(req.params.cageId)
  //if you find the cage
  .then((cage) => {
    Cage.findCageByIdAndRemoveCage(cage._id)
    .then(() => {
      console.log('DAS CAGEEEEEEEEEEE', cage);
      //remove the cage from the lines cage array
      Line.findLineByIdAndRemoveCage(req.params.lineId, cage)
      .then(() => res.status(204).send())
      .catch(next);
    })
    // .then(() => res.status(204).send())
    //if youre unable to findcagebyid and remove cage
    .catch(next);
  })
  //if you dont find the cage
  .catch(err => next(createError(404, err.message)));
});

cageRouter.put('/api/project/:projId/line/:lineId/cage/:cageId', bearerAuth, jsonParser, function(req, res, next) {
  debug('cage router PUT');

  Cage.findById(req.params.cageId)
  .then(cage => {
    let options = {runValidators: true, new: true};
    return Cage.findByIdAndUpdate(cage._id, req.body, options);
  })
  .then((cage) => {
    res.json(cage);
  })
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    if (err.status) return next(err);
    next(createError(404, err.message));
  });
});
