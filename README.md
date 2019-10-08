<h1 align="center"> ⛺ Campkit </h1>

<h3 align="center">Build serverless Node.js microservices fast.</h3>

<br/>

[![serverless](http://public.serverless.com/badges/v3.svg)](https://serverless.com)
[![node](https://img.shields.io/badge/node-%3E%3D%2010.0.0-brightgreen)](https://nodejs.org)
[![awesome](https://img.shields.io/badge/stars-%E2%98%85%E2%98%85%E2%98%85%E2%98%85%E2%98%85-brightgreen)](https://github.com/getcampsite/campkit)

## Intro

**_This project is under heavy development._**

Campkit is an opinionated Node.js framework for building serverless microservices. It makes a bunch of decisions so that you don't have to. Currently it works best with aws lambda and the serverless framework.

## Features

- small & simple
- define your service as a class annotating it to provide configuration
- path and query parameters are automatically injected into the class method
- service discovery built in _(coming soon)_

## Works with provider

- [x] Amazon Web Service - Lambda
- [ ] Google Cloud Platform - Cloud functions
- [ ] Microsoft Azure - Cloud functions

## At a glance

```js
import { Controller, Get, Post } from "@campkit/rest";

@Controller({
  basePath: "/user"
})
export class UserController {

  @Get({
    path: "/:id" // -> GET user/1234
  })
  getUserById({ params }) {
    return {
      id: params.id
    };
  }

  @Post({
    path: "/" // -> POST user/
  })
  createUser({ body }){
    return {
      user: body
    };
  }
```

## Basic microservice

```js
// index.js

import { CampkitFactory } from "@campkit/core";
import { UserApp } from "./user.app";

export const handler = async (event, context) => {
  return await CampkitFactory.create(UserApp, { event, context });
};
```

```js
// user.app.js

import { App } from "@campkit/core";
import { RestApp } from "@campkit/rest";
import { UserController } from "./user.controller";

@App({
  name: "user",
  controllers: [UserController]
})
export class UserApp extends RestApp {
  constructor(options) {
    super(options);
  }
}
```

```js
// user.controller.js

import { Controller, Get, Post } from "@campkit/rest";

@Controller({
  basePath: "/user"
})
export class UserController {

  @Get({
    path: "/:id" // -> GET user/1234
  })
  getUser({ params }) {
    return {
      message: "get user by id",
      id: params.id
    };
  }

  @Post({
    path: "/" // -> POST user/
  })
  createUser({ body }){
    return {
      message: "create a user",
      userInfo: body
    };
  }
```
