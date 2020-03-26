import { Controller, Get } from '@campkit/rest';

@Controller({
  basePath: '/_servicename_',
})
export class _SERVICENAME_Controller {
  @Get({
    path: '/',
  })
  getAll() {
    return {
      message: 'Go Serverless',
    };
  }

  @Get({
    path: '/:id',
  })
  getOne({ params }) {
    return {
      id: params.id || '',
    };
  }
}
