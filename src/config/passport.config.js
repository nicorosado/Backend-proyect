/* eslint-disable camelcase */
/* eslint-disable space-before-function-paren */
import passport from 'passport'
import local from 'passport-local'
import { UserModel } from '../models/users.model.js'
import { createHash, isValidPassword } from './utils.js'
import GitHubStrategy from 'passport-github2'
import fetch from 'node-fetch'
import CartService from '../services/carts.service.js'

const LocalStrategy = local.Strategy
const cartService = new CartService()

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, username, password, done) => {
        try {
          const { email, password } = req.body
          if (!email || !password) {
            req.flash('error', 'Por favor indique su email y password.')
            return done(null, false)
          }

          const user = await UserModel.findOne({ email: username })
          if (!user) {
            req.flash('error', 'Por favor indique su email y password.')
            return done(null, false)
          }

          if (!isValidPassword(password, user.password)) {
            req.flash(
              'error',
              'Por favor indique un email o password correcto.'
            )
            return done(null, false)
          }

          req.session.email = user.email
          req.session.role = user.role
          req.session.first_name = user.first_name
          req.session.last_name = user.last_name
          req.session.age = user.age
          req.session.cartID = user.cartID

          return done(null, user)
        } catch (error) {
          return done(new Error(error))
        }
      }
    )
  )

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, username, password, done) => {
        try {
          const { email, first_name, last_name, age } = req.body
          const user = await UserModel.findOne({ email: username })
          if (user) {
            console.log('User already exists')
            return done(null, false)
          }
          const newCart = await cartService.addCart()
          const cartID = newCart.result.payload._id.toString()
          const newUser = {
            email,
            first_name,
            last_name,
            isAdmin: false,
            age,
            cartID,
            role: 'user',
            password: createHash(password)
          }
          const userCreated = await UserModel.create(newUser)
          req.session.email = email
          req.session.role = 'user'
          req.session.first_name = first_name
          req.session.last_name = last_name
          req.session.age = age
          req.session.cartID = cartID
          console.log(userCreated)
          console.log('User Registration succesful')
          return done(null, userCreated)
        } catch (e) {
          console.log('Error in register')
          console.log(e)
          return done(e)
        }
      }
    )
  )

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: '00d619a714b0bd520ed4',
        clientSecret: 'f188761df54f09485cab74052bd8778fb8d004ef',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28'
            }
          })
          const emails = await res.json()
          const emailDetail = emails.find((email) => email.verified === true)

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'))
          }
          profile.email = emailDetail.email

          const user = await UserModel.findOne({ email: profile.email })
          if (!user) {
            const newCart = await cartService.addCart()
            const cartID = newCart.result.payload._id.toString()

            const displayName = profile.displayName
              ? profile.displayName.split(' ')
              : [profile.username]

            const lastName = displayName[1] || 'nolastname'
            const firstName = displayName[0] || 'noname'

            const userCreated = await UserModel.create({
              first_name: firstName,
              last_name: lastName,
              email: profile.email,
              age: 18,
              password: 'GitHub-User',
              cartID,
              role: 'user'
            })

            // Usuario Creado correctamente
            return done(null, userCreated)
          } else {
            console.log('User already exists')
            return done(null, user)
          }
        } catch (e) {
          console.log('Error en auth github')
          console.log(e)
          return done(e)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
  })
}
