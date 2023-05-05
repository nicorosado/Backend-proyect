import fs from 'fs'
import { v4 as uuid } from 'uuid'

export class CartManager {
  constructor (path) {
    this.path = path
  }

  async saveCarts (carts) {
    const data = JSON.stringify(carts, null, 2)
    await fs.promises.writeFile(this.path, data)
  }

  async getAllCarts () {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  async createNewCart () {
    const newCart = {
      id: uuid(),
      products: []
    }
    const carts = await this.getAllCarts()
    carts.push(newCart)
    await this.saveCarts(carts)
    console.log(newCart)
    return newCart
  }

  async getCartById (cartId) {
    const carts = await this.getAllCarts()
    const cart = carts.find((cart) => cart.id === cartId)
    if (!cart) {
      throw new Error(`cart with id ${cartId} not found`)
    }
    return cart
  }

  async addProductToCart (cartId, productId, quantity = 1) {
    const carts = await this.getAllCarts()
    const cart = carts.find((cart) => cart.id === cartId)
    if (!cart) {
      throw new Error('cart doesnt exists')
    }
    const existingProduct = cart.products.find(
      (product) => product.id === productId
    )
    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      cart.products.push({ id: productId, quantity })
    }
    await this.saveCarts(carts)
    return cart
  }

  async removeProduct (cartId, productId) {
    const carts = await this.getAllCarts()
    const cart = carts.find((cart) => cart.id === cartId)
    if (!cart) {
      throw new Error(`cart with id ${cartId} not found`)
    }
    const productIndex = cart.products.findIndex(
      (product) => product.id === productId
    )
    if (productIndex === -1) {
      throw new Error(`product ${productId} not found in cart ${cartId}`)
    }
    cart.products.splice(productIndex, 1)
    await this.saveCarts(carts)
  }
}
