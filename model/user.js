'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('puptracker:user');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true, minlength: 8},
  findHash: {type: String, unique: true},
});

userSchema.methods.generatePasswordHash = function(password){
  debug('generatePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(createError(400, 'Invalid user information'));
      this.password = hash;
      //this is the user
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password){
  debug('comparePasswordHash');

  return new Promise((resolve, reject) => {
    //compare plain text password that was passed in with the generatePasswordHash
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'Incorrect password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateToken = function() {
  debug('generateToken');
  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then(findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECRET)))
    .catch(err => reject(err));
  });
};

userSchema.methods.generateFindHash = function() {
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    let tries = 0;
    //_generateFindHash will inherit the generateFindHash method?
    _generateFindHash.call(this);
    function _generateFindHash(){
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this.findHash))
      .catch(err => {
        if (tries > 3) return reject(err);
        tries++;
        _generateFindHash.call(this);
      });
    }
  });
};

module.exports = mongoose.model('user', userSchema);
