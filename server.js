'use strict';

//npm modules
const cors = require('cors');
const morgan = require('morgan');
//loads .env file
const dotenv = require('dotenv');
const express = require('express');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const debug = require('debug')('puptracker:server');

//app modules (aka routes)
const authRouter = require('./route/auth-router.js');
const lineRouter = require('./route/line-router.js');
const projectRouter = require('./route/project-router.js');
const cageRouter = require('./route/cage-router.js');
const mouseRouter = require('./route/mouse-router.js');
const errorMiddleware = require('./lib/error-middleware.js');

//load environment vars
dotenv.load();

//setup DB and configure mongoose for promises
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

//module constants
const PORT = process.env.PORT;
const app = express();

//app routes
app.use(authRouter);
app.use(projectRouter);
app.use(lineRouter);
app.use(cageRouter);
app.use(mouseRouter);
//will need following line with frontend
// app.use(express.static(`${__dirname}/build`));

app.use(cors());
app.use(morgan('dev'));
app.use(errorMiddleware);

const server = module.exports = app.listen(PORT, () => {
  debug(`server up on ${PORT}`);
});

server.isRunning = true;
