'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:mouse-router');

const Mouse = require('../model/mouse.js');
const Cage = require('../model/cage.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const mouseRouter = module.exports = Router();

mouseRouter.post('/api/cage/:cageId/mouse', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/cage/:cageId/mouse');

  Cage.findById(req.params.cageId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(cage => {
    req.body.cageId = cage._id;
    req.body.lineId = cage.lineId;
    req.body.projectId = cage.projectId;
    req.body.userId = req.user._id;

    new Mouse(req.body).save()
    .then(mouse => {
      Cage.findCageByIdAndAddMouse(req.params.cageId, mouse)
      .then(cage => {
        req.cage = cage;
        res.json(mouse);
      });
    })
    .catch(err => next(err));
  });
});

// Get mouse by Id
mouseRouter.get('/api/cage/:cageId/mouse/:mouseId', function(req, res, next){
  debug('GET /api/cage/:cageId/mouse/:mouseId');
  Mouse.findById(req.params.mouseId)
  .then(mouse => res.json(mouse))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

// Return all mice associated with cage
// TODO: Test
mouseRouter.get('/api/cage/:cageId/mice', function(req, res, next) {
  debug('GET /api/cage/:cageId/mice');
  Mouse.find({cageId: req.params.cageId})
  .then(mice => res.json(mice))
  .catch(next);
});

mouseRouter.delete('/api/cage/:cageId/mouse/:mouseId', bearerAuth, function(req, res, next) {
  debug('DELETE /api/cage/:cageId/mouse/:mouseId');
  Mouse.findById(req.params.mouseId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then( mouse => {
    Cage.findCageByIdAndRemoveMouse(req.params.cageId, mouse)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
  })
  .catch(err => next(createError(404, err.message)));
});

mouseRouter.put('/api/cage/:cageId/mouse/:mouseId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/cage/:cageId/mouse/:mouseId');

  Mouse.findById(req.params.mouseId)
  .then(mouse => {
    let options = {runValidators: true, new: true};
    return Mouse.findByIdAndUpdate(mouse._id, req.body, options);
  })
  .then(mouse => {
    res.json(mouse);
  })
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    if (err.status) return next(err);
    next(createError(404, 'not found'));
  });
});
