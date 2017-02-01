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

  Line.findById(req.params.lineId)
  .then((line) => {
    cage.lineId = line._id;
    cage.projectId = req.params.projId;
    new Cage(cage).save()
    .then((cage) => {
      Line.findLineByIdAndAddCage(req.params.lineId, cage)
      .then(line => {
        req.line = line;
        res.json(cage);
      });
    })
    .catch(err => {
      if (err.name === 'ValidationError') return next(err);
      if (err.status) return next(err);
      next(createError(404, err.message));
    });
  });
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

//not yet tested
cageRouter.get('/api/project/:projId/line/:lineId/cages', function(req, res, next) {
  debug('GET /api/project/:projId/lines/:lineId/cages');

  Cage.find({lineId: req.params.lineId})
  .then(cages => {
    res.json(cages);
  })
  .catch(err => err.status ? next(err) : next(createError(404, 'no cages for that line')));
});

cageRouter.delete('/api/line/:lineId/cage/:cageId', bearerAuth, function(req, res, next) {
  debug('cage router DELETE');
  Cage.findById(req.params.cageId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then( cage => {
    if(cage.userId.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'invalid userid'));
    return Cage.findByIdAndRemove(req.params.cageId);
  })
  .catch( err => Promise.reject(err))

  // remove all mice associated with the cage
  // .then( () => Mouse.remove({ cageId: req.params.cageId}))
  .then( () => {
    Line.findById(req.params.lineId)
    .then( line => {
      line.cages.forEach( cage => {
        if (line.cages[cage] === req.params.cageId)
          line.cages.splice(line.cages.indexOf(cage), 1);
      });
      return line.save();
    });
  })
  .then( () => res.sendStatus(204))
  .catch(next);
});

cageRouter.put('/api/line/:lineId/cage/:cageId', bearerAuth, jsonParser, function(req, res, next) {
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
