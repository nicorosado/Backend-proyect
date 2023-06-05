/* eslint-disable no-unused-vars */
/* eslint-disable space-before-function-paren */
import { connect } from 'mongoose'
import { Server } from 'socket.io'
import { ProductModel } from '../models/products.model.js'
import { MessageModel } from '../models/messages.model.js'
export async function connectMongo() {
  try {
    await connect(
      'mongodb+srv://nicorosadonr:vVvmPSAf6gJmXL4z@backendcoder.l1bqk8c.mongodb.net/ecommerce?retryWrites=true&w=majority'
    )
    console.log('plug to mongo!')
  } catch (e) {
    console.log(e)
    // eslint-disable-next-line no-throw-literal
    throw 'cannot connect to the db'
  }
}

// SOCKET CONNECTION

export function connectSocket(httpServer) {
  const io = new Server(httpServer)
  // eslint-disable-next-line prefer-const

  io.on('connection', async (socket) => {
    console.log('se abrió un canal de socket ' + socket.id)

    const products = await ProductModel.find({})
    io.emit('products', products)

    socket.on('addProduct', async (product) => {
      try {
        const newProduct = await ProductModel.create(product)
        io.emit('productAdded', newProduct)
      } catch (error) {
        console.error(error)
      }
    })

    socket.on('product:delete', async id => {
      await ProductModel.findByIdAndDelete(id)
      // eslint-disable-next-line no-undef
      io.emit('product:deleted', id)
    })

    socket.on('msg-front-to-back', async (msg) => {
      const msgCreated = await MessageModel.create(msg)
      const msgs = await MessageModel.find({})
      io.emit('msg-back-to-front', msgs)
    })
  })
}
