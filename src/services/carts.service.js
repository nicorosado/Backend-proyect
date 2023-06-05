/* eslint-disable no-useless-catch */
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
      const cart = await CartModel.findById(cartId)
      return cart
    } catch (error) {
      throw error
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const product = await ProductModel.findById(productId)
      if (!product) {
        throw new Error('Product not found')
      }
      const cart = await CartModel.findById(cartId)
      if (!cart) {
        throw new Error('Cart not found')
      }
      const existingProduct = cart.products.find(product => product._id.toString() === productId)
      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        cart.products.push({ _id: productId, quantity: 1 })
      }
      const savedCart = await cart.save()
      return savedCart
    } catch (error) {
      throw error
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId)
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

  async deleteCartById(cartId) {
    try {
      const cart = await CartModel.findByIdAndDelete(cartId)
      if (!cart) {
        throw new Error('Cart not found')
      }
      return cart
    } catch (error) {
      throw error
    }
  }
}
