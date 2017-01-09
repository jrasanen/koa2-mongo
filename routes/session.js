import passport from 'koa-passport';

export default (app) => {
  app.post('/sign-in', async (ctx, next) => {
    await passport.authenticate('local', async (user, info, status) => {
      if (user === false) {
        ctx.session.loggedIn = false
        ctx.redirect('/sign-in');
      } else {
        ctx.session.loggedIn = true
        ctx.login(user)
        ctx.redirect('/');
      }
    })(ctx, next)
  })

  app.get('/logout', async (ctx, next) => {
    ctx.session = null
    await ctx.regenerateSession()
    ctx.redirect('/')
  })

  app.get('/sign-in', async (ctx, next) => {
    await ctx.render('user/index.html')
  })
  return app
}

