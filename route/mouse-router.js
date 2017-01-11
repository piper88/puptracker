'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser');
const debug = require('debug')('puptracker:mouse-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const mouseRouter = module.exports = Router();
