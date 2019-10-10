const { Controller, Get } = require('@campkit/rest');

@Controller({
  basePath: '/',
})
class _SERVICENAME_Controller {
  @Get({
    path: '/:id',
  })
  getOne({ params }) {
    return {
      id: params.id,
    };
  }
}

module.exports = {
  _SERVICENAME_Controller,
};
