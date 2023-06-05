/* eslint-disable space-before-function-paren */
import fs from 'fs'
import { v4 as uuid } from 'uuid'

export class ProductManager {
  constructor(path) {
    this.path = path
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock
    ) {
      throw new Error('missing properties')
    }
    if (!product.thumbnails) {
      product.thumbnails = []
    }
    const products = await this.getProducts()
    const code = product.code
    if (products.find((product) => product.code === code)) {
      throw new Error('code duplicated')
    }
    if (product.status !== false) {
      product.status = true
    }
    product.price = parseInt(product.price)
    product.stock = parseInt(product.stock)
    product = { id: uuid(), ...product }
    products.push(product)
    try {
      const productsString = JSON.stringify(products, null, 2)
      await fs.promises.writeFile(this.path, productsString)
      return product
    } catch (error) {
      throw new Error(error)
    }
  }

  async getProductById(id) {
    const products = await this.getProducts()
    const found = products.find((product) => product._id === id)
    if (!found) {
      throw new Error('Product not found on that id')
    }
    return found
  }

  async getProducts() {
    try {
      const productString = await fs.promises.readFile(this.path, 'utf-8')
      const products = JSON.parse(productString)
      return products
    } catch (error) {
      return []
    }
  }

  async updateProduct(id, newValues) {
    const products = await this.getProducts()
    const productIndex = products.findIndex((product) => product._id === id)

    if (productIndex === -1) {
      throw new Error('Product not found on that id')
    }
    try {
      const { id: _id, ...updateData } = newValues
      const updatedProduct = {
        ...products[productIndex],
        ...updateData
      }

      products[productIndex] = updatedProduct

      const productsString = JSON.stringify(products, null, 2)
      await fs.promises.writeFile(this.path, productsString)
      return updatedProduct
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts()
    const productIndex = products.findIndex((product) => product._id === id)
    if (productIndex === -1) {
      throw new Error('Product not found to delete')
    }

    products.splice(productIndex, 1)

    const productsString = JSON.stringify(products, null, 2)
    try {
      await fs.promises.writeFile(this.path, productsString)
      return 'product deleted'
    } catch (error) {
      throw new Error(error)
    }
  }
}
