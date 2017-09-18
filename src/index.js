'use strict';

/**
 * Module dependencies.
 */

const enums = require('./enums');
const errors = require('./errors');
const { createHash } = require('crypto');

/**
 * Constants.
 */

const { ALGORITHMS, ENCODINGS } = enums;
const { InvalidConfigurationError, InvalidDigestError, WantDigestError } = errors;
const REGEXP = /([^=]+)=([^,]+),?/g;

/**
 * Parse digest.
 */

function parse(digest) {
  const result = new Map();

  digest.replace(REGEXP, (match, key, value) => { result.set(key.toLowerCase(), value); });

  return result;
}

/**
 * Instance digest middleware.
 *
 * @see https://tools.ietf.org/html/rfc3230
 */

function middleware({ algorithms = Object.keys(ALGORITHMS), required = false } = {}) {
  if (!Array.isArray(algorithms)) {
    throw new InvalidConfigurationError();
  }

  algorithms = algorithms.map(algorithm => algorithm.toLowerCase());

  if (algorithms.some(algorithm => !(algorithm in ALGORITHMS))) {
    throw new InvalidConfigurationError();
  }

  return async function instanceDigest(context, next) {
    const digest = context.get('Digest');

    if (!required && !digest) {
      return await next();
    }

    if (required && !digest) {
      throw new WantDigestError({ algorithms });
    }

    if (context.request.length === 0) {
      throw new InvalidDigestError();
    }

    const digests = parse(digest);

    if (!digests.size) {
      throw new InvalidDigestError();
    }

    for (const [digestAlgorithm, digestHash] of digests.entries()) {
      if (!algorithms.includes(digestAlgorithm)) {
        throw new WantDigestError({ algorithms });
      }

      const { [digestAlgorithm]: algorithm } = ALGORITHMS;
      const { [digestAlgorithm]: encoding } = ENCODINGS;

      const hash = createHash(algorithm)
        .update(context.request.rawBody)
        .digest(encoding);

      if (digestHash !== hash) {
        throw new InvalidDigestError();
      }
    }

    await next();
  };
}

/**
 * Exports.
 */

module.exports = { enums, errors, middleware };
