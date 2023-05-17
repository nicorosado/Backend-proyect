import express from 'express'
import { ProductManager } from '../ProductManager.js'

const productManager = new ProductManager('src/products.json')

export const clientRouter = express.Router()

clientRouter.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts()
    res.render('index', { products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

clientRouter.get('/realtimeProducts', async (req, res) => {
  try {
    const products = await productManager.getProducts()
    res.render('realtimeProducts', { products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* clientRouter.post('/realtimeProducts', async (req, res) => {
  try {
    const product = req.body

    await productManager.addProduct(product)

    res.redirect('/realtimeProducts')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}) */
