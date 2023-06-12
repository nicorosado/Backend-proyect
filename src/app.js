import { engine } from 'express-handlebars'
import express from 'express'
import { productRouter } from './routes/products.router.js'
import { cartRouter } from './routes/carts.router.js'
import { clientRouter } from './routes/client.router.js'
import { connectMongo, connectSocket } from './config/utils.js'
import { chatRouter } from './routes/chats.router.js'
import session from 'express-session'

const app = express()
const PORT = 8080

const httpServer = app.listen(PORT, () => {
  console.log(`listening on PORT: http://localhost:${PORT}`)
})

connectMongo()
connectSocket(httpServer)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/chat', chatRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', clientRouter)
app.get('/*', async (req, res) => {
  return res.status(404).json({ status: 'error', message: 'incorrect route' })
})

export { app }
