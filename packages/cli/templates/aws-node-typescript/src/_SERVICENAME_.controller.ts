import { Controller, Get } from '@campkit/rest';

@Controller({
  basePath: '/_servicename_',
})
export class _SERVICENAME_Controller {
  constructor() {}

  @Get({
    path: '/:id',
  })
  getOne({ params }) {
    return {
      message: params.id,
    };
  }

  @Get({
    path: '/',
  })
  getAll() {
    return {
      message: 'Go Serverless',
    };
  }
}
