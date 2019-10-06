# :package: :sparkles: Serverless Campkit Plugin

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-campkit.svg)](https://badge.fury.io/js/serverless-campkit)

Make `campkit` apps compatible with serverless framework.
Ensure compatibility with serverless-offline plugin.

Works with provider :

- [x] **Amazon Web Service - Lambda**
- [ ] **Google Cloud Platform - Cloud functions**
- [ ] **Microsoft Azure - Cloud functions**

This plugin will automatically update your `serverless.yml` to include any routes created by your `campkit` app.

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
import { Handler, Context } from 'aws-lambda';
import { CampkitFactory } from '@campkit/core';
import { AppModule } from './path/to/your/campkit/app';

export const handler: Handler = async (event: any, context: Context) => {
  const app = await CampkitFactory.create(AppModule, { event, context });
  return app;
};
```
