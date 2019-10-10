<h1 align="center"> ⛺ Campkit </h1>
<h3 align="center">Build serverless Node.js microservices fast.</h3>

<br/>

## :package: serverless-campkit

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-campkit.svg)](https://badge.fury.io/js/serverless-campkit)
[![gzip size](http://img.badgesize.io/https://unpkg.com/serverless-campkit@latest/dist/serverless-campkit.cjs.production.min.js?compression=gzip)](https://unpkg.com/serverless-campkit@latest/dist/serverless-campkit.cjs.production.min.js)

## Intro

Make `campkit` apps compatible with serverless framework.
Ensure compatibility with serverless-offline plugin.

This plugin will automatically update your `serverless.yml` to include functionality.

## Download

```shell
npm install --save serverless-campkit
```

or for yarn users

```shell
yarn add serverless-campkit
```

## Installation

### 1 - Add it to your serverless.yml

inside your project's `serverless.yml` file add `serverless-campkit` to the plugin list:

```YAML
plugins:
  - serverless-campkit # <- like so
  - serverless-offline
```

### 2 - Use campkit

```js
const { CampkitFactory } = require('@campkit/core');
const { AppModule } = require('./path/to/your/app');

async function handler(event, context) {
  return await CampkitFactory.create(AppModule, { event, context });
}

module.exports = {
  handler,
};
```
