/* eslint-disable no-useless-catch */
import { ProductModel } from '../models/products.model.js'

/* eslint-disable space-before-function-paren */
class ProductService {
  async getProducts({ limit, page, sort, query }) {
    try {
      const filter = {}
      if (query) {
        filter.$text = { $search: query }
      }
      const sortOptions = {}

      if (sort === 'asc') {
        sortOptions.price = 1
      } else if (sort === 'desc') {
        sortOptions.price = -1
      }

      const options = {
        page,
        limit,
        sort: sortOptions,
        lean: true,
        customLabels: {
          docs: 'payload'
        }
      }

      const result = await ProductModel.paginate(filter, options)

      const totalPages = result.totalPages
      const hasPrevPage = result.hasPrevPage
      const hasNextPage = result.hasNextPage
      const prevPage = result.prevPage
      const nextPage = result.nextPage
      const paramsPrev = new URLSearchParams(`page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}`)
      const paramsNext = new URLSearchParams(`page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}`)
      const prevLink = hasPrevPage ? `/api/products?${paramsPrev.toString()}` : null
      const nextLink = hasNextPage ? `/api/products?${paramsNext.toString()}` : null

      return {
        status: 'success',
        payload: result.payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      }
    } catch (error) {
      throw error
    }
  }

  async getProductById(productId) {
    try {
      const product = await ProductModel.findOne({ _id: productId })
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
