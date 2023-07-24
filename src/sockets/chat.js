import { ChatsModel } from "../DAO/models/chats.models.js";
import productManager from "../DAO/productManager.js";
import { Server } from "socket.io";

export async  function  connectSocket(httpServer){

 const socketServer = new Server(httpServer);
 let products = await productManager.getProducts();
 socketServer.on('connection', socket=>{
     socket.on('new-product', async data=>{
     await productManager.addProduct(data)
     let productsRefresh = await productManager.getProducts()
     socketServer.emit("products",productsRefresh)
     })
 socket.on('delet-product', async data=>{
    await productManager.deleteProduct(data)
    let productsRefresh = await productManager.getProducts()
    socketServer.emit("products",productsRefresh)
    })
 socketServer.emit("products",products)
//CHAT 

async function iniciar(){
  let chat = await ChatsModel.find({}).lean().exec();
  socketServer.emit("all-msg",chat)
}
iniciar();

 socket.on('send-msg', async data=>{
  let message = data.msg;
  let user = data.user;
  let email = data.email;
  await ChatsModel.create({message,user,email})
  let chat = await ChatsModel.find({}).lean().exec();
  socketServer.emit("all-msg",chat)
  })
  socket.emit("evento_socket_individual","este mensaje lo debe recibir el socket")
  socket.broadcast.emit("socket_para_todos_menos_actual","este evento lo recibiran todos menos el actual")
  
})
   
}

