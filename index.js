// App.js
import Koa from 'koa';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

// Middleware for routing.
import middleware from 'koa-router';

// Middleware for logging pretty messages.
import logger from 'koa-logger';

// Middleware for accesing json from ctx.body.
import parser from 'koa-bodyparser';

import views from 'koa-views';

import serve from 'koa-static-server';

import convert from 'koa-convert';

import session from 'koa-generic-session'

import redisStore from 'koa-redis';


// Creates the application.
const app = new Koa();

app.use(serve({rootDir: 'public', rootPath: '/public'}))

// Must be used before any router is used
app.use(views(__dirname + '/views', {
  map: {
    html: 'nunjucks'
  }
}));

app.keys = ['kissa'];

const connectDatabase = (uri) => {
  return new Promise((resolve, reject) => {
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(uri);
  });
}


import routes from './routes';
import passport from 'koa-passport'
require('./auth')

connectDatabase('localhost/things')

app
  .use(parser()) // Parses json body requests.
  .use(session({
    store: redisStore()
  }))
  .use(convert(session()))
  .use(passport.initialize())
  .use(passport.session())
  .use(async (ctx, next) => {
    ctx.state.loggedIn = ctx.session.loggedIn
    ctx.state.username = ctx.session.username
    return await next()
  })
  .use(logger()) // Logs information.
  // A universal interceptor, that prints the ctx each time a request
  // is made on the server.
  .use(async function(ctx, next) {
    //console.log(ctx);
    return await next();
  })

routes(app)

// Start the application.
app.listen(5050, () => console.log('Listening on port 5050.'));

export default app;
