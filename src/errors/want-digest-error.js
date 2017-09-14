'use strict';

/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');

/**
 * Export `WantDigestError`.
 */

module.exports = class WantDigestError extends HttpError {
  /**
   * Constructor.
   */

  constructor({ algorithms }) {
    algorithms = algorithms.join('; ');

    super(400, { headers: { 'Want-Digest': algorithms } });
  }
};
