import middleware from 'koa-router'
import bcrypt from 'bcrypt'
import User from '../models/user'
const api = 'users'

export default (app) => {
  let router = middleware()
  router.prefix(`/${api}`)

  router.get('/', async (ctx, next) => {
    await ctx.render('user/index.html')
  })

  router.post('/', async (ctx, next) => {
    let data = ctx.request.body

    // @TODO: Silly way to ensure we don't hash and empty string.
    try {
      if (data.password.length < 7) {
        throw new Error("Password too small")
      }
      data.password = await bcrypt.hash(data.password, 11)
      let user = await new User(data).save()
    }
    catch (e) {
      console.log(e)
    }
    ctx.redirect('/')
  });

  /*
  router.post('/', async (ctx, next) =>
    ctx.body = await new Stuff(ctx.request.body).save());

  router.get('/:id', async (ctx, next) =>
    ctx.body = await Stuff.findById(ctx.params.id));

  router.put('/:id', async (ctx, next) =>
    ctx.body = await Stuff.findByIdAndUpdate(ctx.params.id, ctx.body));

  router.delete('/:id', async (ctx, next) =>
    ctx.body = await Stuff.findByIdAndRemove(ctx.params.id));
  */
  app.use(router.routes())
  app.use(router.allowedMethods())
  return app
}
