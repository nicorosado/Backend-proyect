import express from 'express'
// import { UserService } from '../services/users.service.js';
import { isAdmin, isUser } from '../middlewares/auth.js'
import passport from 'passport'
export const authRouter = express.Router()

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'can not close session' })
    }
    return res.redirect('/auth/login')
  })
})

authRouter.get('/profile', isUser, (req, res) => {
  return res.render('profile', {
    firstname: req.user.first_name,
    lastname: req.user.last_name,
    email: req.user.email,
    isadmin: req.user.role,
    age: req.user.age,
    cartid: req.user.cartID
  })
})

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failregister' }),
  (req, res) => {
    req.session.email = req.user.email
    req.session.role = req.user.role
    req.session.first_name = req.user.first_name
    req.session.last_name = req.user.last_name
    req.session.age = req.user.age
    req.session.cartID = req.user.cartID
    return res.redirect('/products')
  }
)

authRouter.get('/administration', isUser, isAdmin, (req, res) => {
  return res.send('Data only seen by admins')
})

authRouter.get('/login', (req, res) => {
  return res.render('login', {})
})

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'invalid credentials' })
  } try {
    req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, isAdmin: req.user.isAdmin }
    return res.json({ msg: 'ok', payload: req.user })
  } catch (e) {
    console.log(e)
    return res.status(400).render('error', { error: 'couldnt login' })
  }
})

authRouter.get('/register', (req, res) => {
  return res.render('register', {})
})

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'something went wrong' })
  }
  try {
    req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, isAdmin: req.user.isAdmin }

    return res.json({ msg: 'ok', payload: req.user })
  } catch (e) {
    console.log(e)
    return res.status(400).render('error', { error: 'couldnt create user. Try with another mail' })
  }
})

authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'fail to register' })
})

authRouter.get('/session', (req, res) => {
  return res.send(JSON.stringify(req.session))
})

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'fail to login' })
})
