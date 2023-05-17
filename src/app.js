import { engine } from 'express-handlebars'
import express from 'express'
import { productRouter } from './routes/products.router.js'
import { cartRouter } from './routes/carts.router.js'
import { clientRouter } from './routes/client.router.js'
import { Server } from 'socket.io'
import { ProductManager } from './ProductManager.js'

const app = express()
const PORT = 8080
const productManager = new ProductManager('src/products.json')

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', clientRouter)
app.get('/*', async (req, res) => {
  return res.status(404).json({ status: 'error', message: 'incorrect route' })
})

const httpServer = app.listen(PORT, () => {
  console.log(`listening on PORT: http://localhost:${PORT}`)
})

const io = new Server(httpServer)

io.on('connection', async (socket) => {
  console.log('se abrió un canal de socket ' + socket.id)

  const products = await productManager.getProducts()
  io.emit('products', products)

  socket.on('addProduct', async (product) => {
    try {
      const newProduct = await productManager.addProduct(product)
      io.emit('productAdded', newProduct)
    } catch (error) {
      console.error(error)
    }
  })

  socket.on('product:delete', async id => {
    await productManager.deleteProduct(id)
    // eslint-disable-next-line no-undef
    io.emit('product:deleted', id)
  })
})
export { app }
