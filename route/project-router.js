'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json;
const debug = require('debug')('puptracker:project-router');

const Project = require('../model/project.j');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const projectRouter = module.exports = Router();

//route to add project

//route to delete project

//route to get project

projectRouter.post('/api/project', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/project');
});
