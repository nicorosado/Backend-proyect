import express from 'express'
import { CartManager } from '../CartManager.js'
import { ProductManager } from '../ProductManager.js'

export const cartRouter = express.Router()
const cartManager = new CartManager('src/carts.json')
const productManager = new ProductManager('src/products.json')

cartRouter.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createNewCart()
    res.status(201).json(cart)
  } catch (error) {
    res.status(500).json({ message: 'error creating cart' })
  }
})

cartRouter.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await cartManager.getCartById(cid)
    if (!cart) {
      return res.status(404).json({ status: 'error', message: `cart ${cid} not found` })
    }
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ message: 'error getting cart' })
  }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const product = await productManager.getProductById(pid)
    if (!product) {
      return res.status(400).json({ status: 'error', message: `product ${pid} not found` })
    }
    const quantity = req.body.quantity || 1
    const cart = await cartManager.addProductToCart(cid, product.id, quantity)
    res.status(200).json(cart)
  } catch (error) {
    if (error.message === `cart with id ${parseInt(req.params.cid)} not found`) {
      return res.status(404).json({ status: 'error', message: error.message })
    }
    if (error.message === 'Product not found on that id') {
      return res.status(404).json({ status: 'error', message: `Product not found on id ${parseInt(req.params.pid)}` })
    }
    res.status(500).json({ message: 'FATAL ERROR' })
  }
})
