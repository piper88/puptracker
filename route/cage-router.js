'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('puptracker:cage-router');

const Line = require('../model/line.js');
//const Project = require('../model/project.js');
const Cage = require('../model/cage.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const cageRouter = module.exports = Router();

cageRouter.post('/api/line/:lineId/cage', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/line/:lineId/cage');
  let tempLine, tempCage;
  Line.findById(req.params.lineId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(line => {
    debug('line', line);

    if (line.userId.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'invalid user'));
    req.body.userId = req.user._id;
    req.body.lineId = line._id;
    req.body.projectId = line.projectId;
    tempLine = line;
    return new Cage(req.body).save();
  })
  .then(cage => {
    tempLine.cages.push(cage._id);
    tempCage = cage;
    return tempLine.save();
  })
  .then(() => res.json(tempCage))
  .catch(next);
});

// Return one Cage by id
cageRouter.get('/api/line/:lineId/cage/:cageId', function(req, res, next) {
  debug('cage router GET');
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
  // .populate('mice')
  .then(cages => res.json(cages))
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
