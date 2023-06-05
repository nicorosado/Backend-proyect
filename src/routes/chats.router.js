import express from 'express'

export const chatRouter = express.Router()

chatRouter.get('/', async (req, res) => {
  return res.render('chat', {})
})
