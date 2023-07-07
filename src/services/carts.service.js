/* eslint-disable no-useless-catch */
import mongoose from 'mongoose'
import { CartModel } from '../models/carts.model.js'
import { ProductModel } from '../models/products.model.js'

/* eslint-disable space-before-function-paren */
export default class CartService {
  async createCart() {
    try {
      const cart = await CartModel.create({})
      return cart
    } catch (err) {
      throw err
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId }).populate('products.productId').lean()
      return cart
    } catch (error) {
      throw error
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const product = await ProductModel.findOne({ _id: productId })
      if (!product) {
        console.log('no product')
        throw new Error('Product not found')
      }
      const cart = await CartModel.findOne({ _id: cartId })
      if (!cart) {
        console.log('no cart')
        throw new Error('Cart not found')
      }
      const existingProduct = cart.products.find(product => productId.toString() === productId)
      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        cart.products.push({ productId })
      }
      const savedCart = (await cart.save()).populate('products.productId')
      return savedCart
    } catch (error) {
      throw error
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId })
      if (!cart) {
        throw new Error('Cart not found')
      }

      const productIndex = cart.products.findIndex(product => product._id.toString() === productId)
      if (productIndex === -1) {
        throw new Error('Product not found in the cart')
      }

      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1
      } else {
        cart.products.splice(productIndex, 1)
      }

      const savedCart = await cart.save()
      return savedCart
    } catch (error) {
      throw error
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId })
      if (!cart) {
        throw new Error('Cart not found')
      }
      cart.products = []
      const clearedCart = await cart.save()
      return clearedCart
    } catch (error) {
      throw error
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await CartModel.findOne({ _id: cartId })
      if (!cart) {
        throw new Error('Cart not found')
      }
      cart.products = products.map((product) => ({
        productId: product._id,
        quantity: product.quantity
      }))
      const updatedCart = (await cart.save()).populate('products.productId')
      return updatedCart
    } catch (error) {
      throw error
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findOne({ _id: cartId })
      if (!cart) {
        throw new Error('Cart not found')
      }
      const productIndex = cart.products.findIndex(product => productId.toString() === productId)
      if (productIndex === -1) {
        throw new Error('Product not found in the cart')
      }
      const updatedQuantity = cart.products[productIndex].quantity + quantity
      cart.products[productIndex].quantity = updatedQuantity
      const updatedCart = (await cart.save()).populate('products.productId')
      return updatedCart
    } catch (error) {
      throw error
    }
  }

  async addCart(cartId, prodId) {
    try {
      if (cartId === undefined || prodId === undefined) {
        const newCart = await CartModel.create({})
        return { status: 200, result: { status: 'success', payload: newCart } }
      } else {
        if (
          !mongoose.Types.ObjectId.isValid(prodId) ||
          !mongoose.Types.ObjectId.isValid(cartId)
        ) {
          return {
            status: 400,
            result: {
              status: 'error',
              error: '🛑 Invalid product or card ID.'
            }
          }
        }
      }

      const productFiltered = await ProductModel.findOne({ _id: prodId })
      const cartFiltered = await CartModel.findOne({ _id: cartId })

      if (!productFiltered || !cartFiltered) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: '🛑 Product or Cart not found.'
          }
        }
      }

      const productIndex = cartFiltered.products.findIndex((p) =>
        p.id.equals(prodId)
      )

      if (productIndex !== -1) {
        cartFiltered.products[productIndex].quantity += 1
      } else {
        cartFiltered.products.push({ id: prodId, quantity: 1 })
      }

      await cartFiltered.save()

      return {
        status: 200,
        result: { succes: true, payload: cartFiltered }
      }
    } catch (err) {
      console.log(err)
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} }
      }
    }
  }
}
