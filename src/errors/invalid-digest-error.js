'use strict';

/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');

/**
 * Export `InvalidDigestError`.
 */

module.exports = class InvalidDigestError extends HttpError {
  /**
   * Constructor.
   */

  constructor() {
    super(400);
  }
};
