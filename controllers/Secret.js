'use strict';

var utils = require('../utils/writer.js');
var Secret = require('../service/SecretService');

module.exports.addSecret = function addSecret (req, res, next) {
  var secret = req.swagger.params['secret'].value;
  var expireAfterViews = req.swagger.params['expireAfterViews'].value;
  var expireAfter = req.swagger.params['expireAfter'].value;
  Secret.addSecret(secret,expireAfterViews,expireAfter)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSecretByHash = function getSecretByHash (req, res, next) {
  var hash = req.swagger.params['hash'].value;
  Secret.getSecretByHash(hash)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
