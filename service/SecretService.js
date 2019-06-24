'use strict';
const dbService = require('./DBService');
var hashGenerator = require('random-hash');




/**
 * Add a new secret
 * 
 *
 * secret String This text will be saved as a secret
 * expireAfterViews Integer The secret won't be available after the given number of views. It must be greater than 0.
 * expireAfter Integer The secret won't be available after the given time. The value is provided in minutes. 0 means never expires
 * returns Secret
 **/
exports.addSecret = function(secret,expireAfterViews,expireAfter) {

    return new Promise(function(resolve, reject) {
      var hash = hashGenerator.generateHash();
      var now = Date.now();
      
  dbService.setSecret(hash, secret, expireAfterViews, 60 * 1000 * expireAfter + now, now, (row) => {
    var examples = {};
    examples['application/json'] = {
  "secretText" : row.secretText,
  "createdAt" : new Date(row.createdAt),
  "remainingViews" : row.remainingViews,
  "hash" : row.hash,
  "expiresAt" : new Date(row.expiresAt)
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  })
  })
}
exports.getSecretByHash = function(hash) {
  return new Promise(function(resolve, reject) {
    dbService.getSecretByHash(hash, (row) => {
     var now = Date.now();
     var examples = {};
     console.log("now: " + (now < row.expiresAt));
     console.log("row.expiresAt" + row.remainingViews); 
     if((now < row.expiresAt) && (row.remainingViews > 0))
      {
    
        examples['application/json'] = {
          "secretText" : row.secretText,
          "createdAt" : new Date(row.createdAt),
          "remainingViews" : row.remainingViews,
          "hash" : row.hash,
          "expiresAt" : new Date(row.expiresAt)
        };
      }
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  }
    )
})}