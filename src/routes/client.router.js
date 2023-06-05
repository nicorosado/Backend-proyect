import express from 'express'
import { ProductModel } from '../models/products.model.js'

export const clientRouter = express.Router()

clientRouter.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find({}).lean().exec()
    res.render('index', { products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

clientRouter.get('/realtimeProducts', async (req, res) => {
  try {
    const products = await ProductModel.find({}).lean().exec()
    res.render('realtimeProducts', { products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
