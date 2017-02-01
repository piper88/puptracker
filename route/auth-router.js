'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('puptracker:auth-router');
const jsonParser = require('body-parser').json();

const basicAuth = require('../lib/basic-auth-middleware.js');

const User = require('../model/user.js');

const authRouter = module.exports = Router();

//dont need this route, no signup option
authRouter.post('/api/signup', jsonParser, function(req, res, next){
  debug('POST /api/signup');

  //they will send username, password, and we give them token back
  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);

  user.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});

//just have login option, one username and password
authRouter.get('/api/login', basicAuth, function(req, res, next){
  debug('GET /api/login');

  User.findOne({username: req.auth.username})
  .then(user => user.comparePasswordHash(req.auth.password))
  .catch(err => Promise.reject(createError(401, err.message)))
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});
