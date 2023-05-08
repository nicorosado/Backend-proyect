import express from 'express'
import { ProductManager } from '../ProductManager.js'
const productManager = new ProductManager('src/products.json')
export const productRouter = express.Router()

productRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit
    const products = await productManager.getProducts()
    if (limit) {
      res.status(200).json({ status: 'success', payload: (products.slice(0, limit)) })
    } else {
      res.status(200).json({ status: 'success', payload: products })
    }
  } catch (error) {
    res.status(500).json({ status: 'success', message: 'error' })
  }
})

productRouter.get('/:pid', async (req, res) => {
  try {
    const id = req.params.pid
    const product = await productManager.getProductById(id)
    res.status(200).json({ status: 'success', payload: product })
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(409).json({ status: 'error', message: error.message })
    }
    if (error.message === 'code duplicated') {
      return res.status(409).json({ status: 'error', message: error.message })
    }
    res.status(500).json({ status: 'error', message: 'error' })
  }
})

productRouter.post('/', async (req, res) => {
  try {
    const newProduct = req.body
    const product = await productManager.addProduct(newProduct)
    return res.status(201).json({ status: 'success', payload: product })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
})

productRouter.put('/:pid', async (req, res) => {
  const newValues = req.body
  const id = req.params.pid
  try {
    if (newValues.id) {
      return res.status(400).json({ status: 'error', error: "can't change id" })
    }
    const newProduct = await productManager.updateProduct(
      (id),
      newValues
    )
    return res.status(200).json({ status: 'success', payload: newProduct })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
})

productRouter.delete('/:pid', async (req, res) => {
  const id = req.params.pid
  try {
    const products = await productManager.deleteProduct((id))
    return res.status(200).json({ status: 'success', products })
  } catch (error) {
    return res.status(500).json({ status: 'success', message: error.message })
  }
})
