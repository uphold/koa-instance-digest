'use strict';

/**
 * Module dependencies.
 */

const InvalidConfigurationError = require('./invalid-configuration-error');
const InvalidDigestError = require('./invalid-digest-error');
const WantDigestError = require('./want-digest-error');

/**
 * Export named errors.
 */

module.exports = {
  InvalidConfigurationError,
  InvalidDigestError,
  WantDigestError
};
