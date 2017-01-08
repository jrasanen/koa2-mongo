import passport from 'koa-passport'
import bcrypt from 'bcrypt'
import User from './models/user'

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findOne({ '_id': id})
    done(null, user)
  } catch(err) {
    done(err)
  }
})

import { Strategy } from 'passport-local'
passport.use('local', new Strategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  await User.findOne({ 'username': username })
    .then(async (user) => {
      if (username === user.username) {
        return await bcrypt.compare(password, user.password).then(async (res) => {
          if (res) {
            done(null, user)
          } else {
            done(null, false)
          }

        })
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err))
}))


