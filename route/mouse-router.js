'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:mouse-router');

const Mouse = require('../model/mouse.js');
const Cage = require('../model/cage.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const mouseRouter = module.exports = Router();

mouseRouter.post('/api/project/:projId/line/:lineId/cage/:cageId/mouse', bearerAuth, jsonParser, function(req, res, next) {
  debug('mouse router POST to add mouse');

  if (!req.body) return Promise.reject(createError(400, 'no body'));
  let mouse = req.body;
  mouse.projectId = req.params.projId;
  mouse.lineId = req.params.lineId;
  mouse.cageId = req.params.cageId;

  new Mouse(req.body).save()
  .then((mouse) => {
    console.log('DAS MOUSEEEEEEEEEE', mouse);
    Cage.findCageByIdAndAddMouse(req.params.cageId, mouse)
    .then((cage) => {
      req.cage = cage;
      res.json(mouse);
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
});

mouseRouter.get('/api/project/:projId/line/:lineId/cage/:cageId/mouse/:mouseId', function(req, res, next){
  debug('mouse router GET mouse');

  Mouse.findById(req.params.mouseId)
  .then((mouse) => {
    res.json(mouse);
  })
  .catch(err => next(createError(404, err.message)));
});

//not yet tested
mouseRouter.get('/api/project/:projId/line/:lineId/cage/:cageId/mice', function(req, res, next) {
  debug('GET /api/project/:projId/lines/:lineId/cage/:cageId/mice');

  Mouse.find({cageId: req.params.cageId})
  .then(mice => {
    res.json(mice);
  })
  .catch(err => err.status ? next(err) : next(createError(404, 'no mice for that cage')));
});

mouseRouter.delete('/api/project/:projId/line/:lineId/cage/:cageId/mouse/:mouseId', bearerAuth, function(req, res, next) {
  debug('mouse router DELETE mouse');

  Mouse.findById(req.params.mouseId)
  .then(mouse => {
    Cage.findCageByIdAndRemoveMouse(req.params.cageId, mouse)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
  })
  .catch(err => next(createError(404, err.message)));
});

mouseRouter.put('/api/project/:projId/line/:lineId/cage/:cageId/mouse/:mouseId', bearerAuth, jsonParser, function(req, res, next) {
  debug('mouse router PUT mouse');

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
