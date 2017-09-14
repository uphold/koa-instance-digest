# koa-instance-digest
A middleware to handle verification of HTTP digest headers as described in [RFC-3230](https://tools.ietf.org/html/rfc3230) "Instance Digests in HTTP".

Note that, as per the _RFC_, this module provides:

  - Digest coverage for entire instances communicated via HTTP.
  - Support for multiple digest algorithms.
  - Negotiation of the use of digests.

However, it does _NOT_ provide:

  - header integrity
  - authentication
  - privacy
  - authorization

## Status

[![npm version][npm-image]][npm-url] [![build status][travis-image]][travis-url]

## Installation

Install the package via `yarn`:

```sh
❯ yarn add koa-instance-digest
```

or via `npm`:

```sh
❯ npm install koa-instance-digest --save
```

### Available algorithms

The following algorithms are available: `md5`, `sha`, `sha-256`, `sha-512`.

### Configuration

The middleware can be configured with the following parameters:

- `algorithms`: List of supported algorithms (all by default).
- `required`: Whether to set a digest header as mandatory (`false` by default).

You can change the defaults by doing:

```javascript
middleware({
  algorithms: ['sha-256'],
  required: true
});
```

## Usage

```javascript
const { middleware } = require('koa-instance-digest');
const Koa = require('koa');

const app = new Koa();

app.post('/', middleware(), async ctx => {
  // Your code here ...
});

app.listen(3000);
```

### Request

The `Digest` header can be provided as follows:

```javascript
'Digest: <algorithm>=<value>'
```

### Response

If the header is missing the following header will be added to the response:

```javascript
'Want-Digest: <list-of-accepted-algorithms>'
```

## Tests

```sh
❯ yarn test
```

## Release

```sh
❯ npm version [<new version> | major | minor | patch] -m "Release %s"
```

[npm-image]: https://img.shields.io/npm/v/koa-instance-digest.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-instance-digest
[travis-image]: https://img.shields.io/travis/uphold/koa-instance-digest.svg?style=flat-square
[travis-url]: https://travis-ci.org/uphold/koa-instance-digest
