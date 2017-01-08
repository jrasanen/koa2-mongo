import middleware from 'koa-router';

export default (app) => {
  app.get('/', async (ctx, next) => {
    await ctx.render('landing/index.html')
  })

  return app
}
