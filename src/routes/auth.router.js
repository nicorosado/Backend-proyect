import express from 'express'
import { UserModel } from '../models/users.model.js'
// import { UserService } from '../services/users.service.js';
import { isAdmin, isUser } from '../middlewares/auth.js'
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
  const user = { email: req.session.email, isAdmin: req.session.isAdmin }
  return res.render('profile', { user })
})

authRouter.get('/administration', isUser, isAdmin, (req, res) => {
  return res.send('Data only seen by admins')
})

authRouter.get('/login', (req, res) => {
  return res.render('login', {})
})

authRouter.post('/login', async (req, res) => {
  const { email, pass } = req.body
  if (!email || !pass) {
    return res.status(400).render('error', { error: 'put your email and pass' })
  }
  const foundUser = await UserModel.findOne({ email })
  if (foundUser && foundUser.pass === pass) {
    req.session.email = foundUser.email
    req.session.isAdmin = foundUser.isAdmin

    return res.redirect('/auth/profile')
  } else {
    return res.status(401).render('error', { error: 'email or pass are wrong' })
  }
})

authRouter.get('/register', (req, res) => {
  return res.render('register', {})
})

authRouter.post('/register', async (req, res) => {
  const { email, pass, firstName, lastName } = req.body
  if (!email || !pass || !firstName || !lastName) {
    return res.status(400).render('error', { error: 'wrong data' })
  }
  try {
    await UserModel.create({ email, pass, firstName, lastName, isAdmin: false })
    req.session.email = email
    req.session.isAdmin = false

    return res.redirect('/auth/profile')
  } catch (e) {
    console.log(e)
    return res.status(400).render('error', { error: 'couldnt create user. Try with another mail' })
  }
})
