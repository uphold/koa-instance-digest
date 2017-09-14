'use strict';

/**
 * Module dependencies.
 */

require('should');

const { enums, errors, middleware } = require('..');
const Koa = require('koa');
const body = require('koa-bodyparser');
const request = require('supertest');
const should = require('should');

/**
 * Test `instance-digest`.
 */

describe('index', () => {
  describe('exports', () => {
    it('should export `enums`', () => {
      enums.should.be.an.instanceof(Object);
    });

    it('should export `errors`', () => {
      errors.should.be.an.instanceof(Object);
    });

    it('should export `middleware`', () => {
      middleware.should.be.an.instanceof(Function);
    });
  });

  describe('middleware', () => {
    let app;
    let server;

    beforeEach(() => {
      app = new Koa();

      app.silent = true;

      server = app.listen();
    });

    afterEach(() => server.close());

    it('should throw an `InvalidConfigurationError` if `algorithms` is not an array', () => {
      try {
        app.use(middleware({ algorithms: {}, required: true }));

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(errors.InvalidConfigurationError);
      }
    });

    it('should throw an `InvalidConfigurationError` if any given `algorithm` is not supported', () => {
      try {
        app.use(middleware({ algorithms: ['foobar', 'sha-256'], required: true }));

        should.fail();
      } catch (e) {
        e.should.be.instanceOf(errors.InvalidConfigurationError);
      }
    });

    it('should allow algorithms to be case-insensitive', () => {
      app.use(middleware({ algorithms: ['sha-256', 'sha-256'], required: true }));
    });

    it('should return 400 if `required` is true and the `Digest` header is missing', () => {
      app.use(middleware({ algorithms: ['sha-256'], required: true }));

      return request(server)
        .post('/')
        .expect('Want-Digest', 'sha-256')
        .expect(400);
    });

    it('should return 400 if no body is given', () => {
      app.use(body());
      app.use(middleware());

      return request(server)
        .post('/')
        .set('Digest', 'sha-256=bar')
        .expect(400);
    });

    it('should return 400 if the digest algorithm is invalid', () => {
      app.use(middleware({ algorithms: ['sha-256'] }));

      return request(server)
        .post('/')
        .set('Digest', '{}=bar')
        .send({ foo: 'bar' })
        .expect('Want-Digest', 'sha-256')
        .expect(400);
    });

    it('should return 400 if the digest algorithm is not supported', () => {
      app.use(middleware({ algorithms: ['sha-256', 'sha-512'] }));

      return request(server)
        .post('/')
        .set('Digest', 'foo=bar')
        .send({ foo: 'bar' })
        .expect('Want-Digest', 'sha-256; sha-512')
        .expect(400);
    });

    it('should return 400 if the digest is invalid', () => {
      app.use(body());
      app.use(middleware());

      return request(server)
        .post('/')
        .set('Digest', 'sha-256=bar')
        .send({ foo: 'bar' })
        .expect(400);
    });

    it('should return 200 if `required` is false and the `Digest` header is missing', () => {
      app.use(middleware());
      app.use(context => {
        context.body = '';
      });

      return request(server)
        .post('/')
        .expect(200);
    });

    it('should accept a case-insensitive `algorithm`', () => {
      app.use(body());
      app.use(middleware());
      app.use(context => {
        context.body = '';
      });

      return request(server)
        .post('/')
        .set('Digest', 'sHa-256=eji/gfOD9pQzrW6QDTWz4jhVk/dqe3q11DVbi6Qe4ks=')
        .send({ foo: 'bar' })
        .expect(200);
    });

    it('should accept multiple digests', () => {
      app.use(body());
      app.use(middleware());
      app.use(context => {
        context.body = '';
      });

      return request(server)
        .post('/')
        .set('Digest', 'sHa-256=eji/gfOD9pQzrW6QDTWz4jhVk/dqe3q11DVbi6Qe4ks=, MD5=m7WPJhkuS6APAeLnsTa72A==')
        .send({ foo: 'bar' })
        .expect(200);
    });

    it('should return 200 if the algorithm is `md5` and the digest is valid', () => {
      app.use(body());
      app.use(middleware());
      app.use(context => {
        context.body = '';
      });

      return request(server)
        .post('/')
        .set('Digest', 'MD5=m7WPJhkuS6APAeLnsTa72A==')
        .send({ foo: 'bar' })
        .expect(200);
    });

    it('should return 200 if the algorithm is `sha` and the digest is valid', () => {
      app.use(body());
      app.use(middleware());
      app.use(context => {
        context.body = '';
      });

      return request(server)
        .post('/')
        .set('Digest', 'SHA=pedE0BZFQNM7HX6mFsKPL6l+dUo=')
        .send({ foo: 'bar' })
        .expect(200);
    });

    it('should return 200 if the algorithm is `sha-256` and the digest is valid', () => {
      app.use(body());
      app.use(middleware());
      app.use(context => {
        context.body = '';
      });

      return request(server)
        .post('/')
        .set('Digest', 'sha-256=eji/gfOD9pQzrW6QDTWz4jhVk/dqe3q11DVbi6Qe4ks=')
        .send({ foo: 'bar' })
        .expect(200);
    });

    it('should return 200 if the algorithm is `sha-512` and the digest is valid', () => {
      app.use(body());
      app.use(middleware());
      app.use(context => {
        context.body = '';
      });

      return request(server)
        .post('/')
        .set('Digest', 'SHA-512=DbaK1OQdOya6P8SKXafJ9ha4E+d8tOlRGH4fKjfCutlAQQififYBLue0TiH4Y8XZVT47Zl7a6GQLsidLVVJm6w==')
        .send({ foo: 'bar' })
        .expect(200);
    });
  });
});
