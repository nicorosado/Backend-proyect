import { engine } from 'express-handlebars'
import express from 'express'
import { productRouter } from './routes/products.router.js'
import { cartRouter } from './routes/carts.router.js'
import { clientRouter } from './routes/client.router.js'
import { authRouter } from './routes/auth.router.js'
import { connectMongo, connectSocket } from './config/utils.js'
import { chatRouter } from './routes/chats.router.js'
import { sessionsRouter } from './routes/sessions.router.js'
import { viewsRouter } from './routes/views.router.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import { iniPassport } from './config/passport.config.js'
import passport from 'passport'

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

app.use(cookieParser())
app.use(

  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://nicorosadonr:vVvmPSAf6gJmXL4z@backendcoder.l1bqk8c.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 7200 }),
    secret: 'mysecretkey',
    resave: true,
    saveUninitialized: true
  })
)
iniPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)
app.use('/chat', chatRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/client', clientRouter)
app.use('/auth', authRouter)
app.get('/*', async (req, res) => {
  return res.status(404).json({ status: 'error', message: 'incorrect route' })
})

export { app }
