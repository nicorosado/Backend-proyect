import express from 'express'
import CartService from '../services/carts.service.js'
export const cartRouter = express.Router()
const cartService = new CartService()

cartRouter.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await cartService.getCartById(cid)
    if (!cart) {
      return res.status(404).json({ status: 'error', message: `cart ${cid} not found` })
    }
    res.status(200).json({ status: 'success', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'error getting cart' })
  }
})

cartRouter.post('/', async (req, res) => {
  try {
    const cart = await cartService.createCart()
    res.status(201).json({ status: 'success', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'error creating cart' })
  }
})

// obtener cartId de coookie
// si no existe
//    crear cart
// agregar prod

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = await cartService.addProductToCart(cid, pid)
    res.status(200).json({ status: 'success', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'FATAL ERROR' })
  }
})

cartRouter.delete('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await cartService.clearCart(cid)
    return res.status(200).json({
      status: 'success',
      msg: 'Cart deleted',
      payload: cart
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      msg: error.message
    })
  }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = await cartService.removeProductFromCart(cid, pid)
    return res.status(200).json({
      status: 'success',
      msg: 'Product removed from cart',
      payload: cart
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      msg: error.message
    })
  }
})

cartRouter.put('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid
    const products = req.body.products
    const cart = await cartService.updateCart(cid, products)
    return res.status(200).json({
      status: 'success',
      msg: 'cart updated',
      payload: cart
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      msg: 'Something went wrong',
      data: {}
    })
  }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity

    const cart = await cartService.updateProductQuantity(cid, pid, quantity)
    return res.status(200).json({
      status: 'success',
      msg: 'Product quantity updated in cart',
      payload: cart
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      msg: 'Something went wrong',
      data: {}
    })
  }
})
