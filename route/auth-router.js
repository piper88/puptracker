'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('puptracker:auth-router');
const jsonParser = require('body-parser').json();

const basicAuth = require('../lib/basic-auth-middleware.js');

const User = require('../model/user.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next){
  debug('POST /api/signup');

  //they will send username, password, and we give them token back
  let password = req.body.password;
  delete req.body.password;

  User.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/api/login', basicAuth, function(req, res, next){
  debug('GET /api/login');

  User.findOne({username: req.auth.username})
  .catch(err => Promise.reject(createError(401, err.message)))
  .then(user => user.comparePasswordHash(req.auth.password))
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});
