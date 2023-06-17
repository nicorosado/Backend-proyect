import express from 'express'
import { ProductModel } from '../models/products.model.js'
import ProductService from '../services/products.service.js'
import CartService from '../services/carts.service.js'
export const clientRouter = express.Router()
const productService = new ProductService()
const cartService = new CartService()

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

clientRouter.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1
    const sort = req.query.sort || ''
    const query = req.query.query || ''

    const result = await productService.getProducts({
      limit,
      page,
      sort,
      query
    })

    res.render('products', {
      products: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'error' })
  }
})

clientRouter.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid

    const cart = await cartService.getCartById(cartId)

    res.render('carts', { cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Error retrieving cart' })
  }
})
