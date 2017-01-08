import middleware from 'koa-router';

import apiUsers from './users';
import apiSession from './session';
import landing from './landing';

export default (app) => {
  const router = middleware()
  landing(router)
  apiUsers(router)
  apiSession(router)

  app.use(router.routes())
  app.use(router.allowedMethods())
}

