'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:cage-router');

const Line = require('../model/line.js');
const Cage = require('../model/cage.js');
const Mouse= require('../model/mouse.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const cageRouter = module.exports = Router();

cageRouter.post('/api/line/:lineId/cage', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/line/:lineId/cage');

  Line.findById(req.params.lineId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(line => {
    req.body.lineId = line._id;
    req.body.projectId = line.projectId;
    req.body.userId = req.user._id;

    new Cage(req.body).save()
    .then(cage => {
      Line.findLineByIdAndAddCage(req.params.lineId, cage)
      .then(line => {
        req.line = line;
        res.json(cage);
      });
    })
    .catch(err => next(err));
  });
});

// Return one Cage by Id
cageRouter.get('/api/cage/:cageId', function(req, res, next) {
  debug('GET /api/cage/:cageId');
  Cage.findById(req.params.cageId)
  .then(cage => res.json(cage))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

// Return all cages associated with line
cageRouter.get('/api/line/:lineId/cages', function(req, res, next) {
  debug('GET /api/line/:lineId/cages');
  Cage.find({lineId: req.params.lineId})
  .populate('mice')
  .then(cages => res.json(cages))
  .catch(next);
});

// Delete cage and all associated mice
cageRouter.delete('/api/line/:lineId/cage/:cageId', bearerAuth, function(req, res, next) {
  debug('DELETE /api/line/:lineId/cage/:cageId');
  Cage.findById(req.params.cageId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then( cage => {
    if(cage.userId.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'invalid userid'));
    return Cage.findByIdAndRemove(req.params.cageId);
  })
  .catch( err => Promise.reject(err))

  // remove all mice associated with the cage
  .then( () => Mouse.remove({ cageId: req.params.cageId}))
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
