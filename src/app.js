import express from 'express'
import { productRouter } from './routes/products.router.js'
import { cartRouter } from './routes/carts.router.js'
import bodyParser from 'body-parser'
const app = express()
const PORT = 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.get('/*', async (req, res) => {
  return res.status(404).json({ status: 'error', message: 'incorrect route' })
})
app.listen(PORT, () => {
  console.log(`listening on PORT: http://localhost:${PORT}`)
})

export { app }
