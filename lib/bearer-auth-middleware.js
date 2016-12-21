'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('puptracker:bearer-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer-auth-middleware');
  let authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, 'requires auth header'));
  if (authHeader.split(' ')[0] !== 'Bearer') return next(createError(401, 'bad header, not bearer auth'));
  let token = authHeader.split('Bearer ')[1];
  if (!token) return next(createError(401, 'requires token'));
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') return next(createError(401, 'Bad permissions'));
      else return next(err); //500 error
    }
    User.findOne({findHash: decoded.token})
    .then(user => {
      debug('USER!!!!!', user);
      req.user = user;
      next();
    })
    .catch(err => {
      next(createError(401, err.message));
    })
  });
};
