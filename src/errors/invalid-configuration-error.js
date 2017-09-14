'use strict';

/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');

/**
 * Export `InvalidConfigurationError`.
 */

module.exports = class InvalidConfigurationError extends HttpError {
  /**
   * Constructor.
   */

  constructor() {
    super(500);
  }
};
