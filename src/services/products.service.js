/* eslint-disable no-useless-catch */
import { ProductModel } from '../models/products.model.js'

/* eslint-disable space-before-function-paren */
class ProductService {
  async getAllProducts() {
    try {
      const products = await ProductModel.find().lean()
      return products
    } catch (error) {
      throw error
    }
  }

  async getProductById(productId) {
    try {
      const product = await ProductModel.findById(productId)
      return product
    } catch (error) {
      throw error
    }
  }

  async createProduct(productData) {
    try {
      const product = await ProductModel.create(productData)
      return product
    } catch (error) {
      throw error
    }
  }

  async updateProduct(productId, productData) {
    try {
      const product = await ProductModel.findByIdAndUpdate(
        productId,
        productData,
        { new: true }
      )
      return product
    } catch (error) {
      throw error
    }
  }

  async deleteProduct(productId) {
    try {
      const product = await ProductModel.findByIdAndDelete(productId)
      return product
    } catch (error) {
      throw error
    }
  }
};

export default ProductService
