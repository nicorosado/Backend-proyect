import express from 'express'
import ProductService from '../services/products.service.js'
const productService = new ProductService()

export const productRouter = express.Router()
productRouter.get('/', async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const limit = req.query.limit
    const products = await productService.getAllProducts()
    res.status(200).json({ status: 'success', payload: products })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'error' })
  }
})

productRouter.get('/:pid', async (req, res) => {
  try {
    const id = req.params.pid
    const product = await productService.getProductById(id)
    res.status(200).json({ status: 'success', payload: product })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'error' })
  }
})

productRouter.post('/', async (req, res) => {
  const productData = req.body
  try {
    const product = await productService.createProduct(productData)
    return res.status(201).json({
      status: 'success',
      msg: 'user created',
      data: product
    })
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {}
    })
  }
})

productRouter.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const productData = req.body
    const updatedProduct = await productService.updateProduct(id, productData)
    return res.status(201).json({
      status: 'success',
      msg: 'user uptaded',
      data: updatedProduct
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {}
    })
  }
})

productRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    // eslint-disable-next-line no-unused-vars
    const deletedProduct = await productService.deleteProduct(id)
    return res.status(200).json({
      status: 'success',
      msg: 'user deleted',
      data: {}
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {}
    })
  }
})
