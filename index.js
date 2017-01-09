import Koa from 'koa';
import mongoose from 'mongoose';
import bluebird from 'bluebird'
mongoose.Promise = bluebird;

// Middleware for routing.
import middleware from 'koa-router';

// Middleware for logging pretty messages.
import logger from 'koa-logger';

// Middleware for accesing json from ctx.body.
import parser from 'koa-bodyparser';

// Middleware for serving static files
import serve from 'koa-static-server';

// Views
import views from 'koa-views';

// Convert koa 1 -> koa 2
import convert from 'koa-convert';

// Session support
import session from 'koa-generic-session'
import redisStore from 'koa-redis';

import passport from 'koa-passport'

// Load routes
import routes from './routes';


// Creates the application.
const app = new Koa();

app.use(serve({rootDir: 'public', rootPath: '/public'}))

// Must be used before any router is used
app.use(views(__dirname + '/views', {
  map: {
    html: 'nunjucks'
  }
}));

// For sessions
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


require('./auth')

connectDatabase('localhost/things')

app
  .use(parser())
  .use(session({
    store: redisStore()
  }))
  .use(convert(session()))
  .use(passport.initialize())
  .use(passport.session())
  .use(async (ctx, next) => {
    // Add global template variables.
    ctx.state.loggedIn = ctx.session.loggedIn
    ctx.state.username = ctx.session.username
    return await next()
  })
  .use(logger()) // Logs information.
  // A universal interceptor, that prints the ctx each time a request
  // is made on the server.
  .use(async function(ctx, next) {
    console.log(ctx);
    return await next();
  })

// Initialize routes
routes(app)

app.listen(5050, () => console.log('Listening on port 5050.'));

export default app;
