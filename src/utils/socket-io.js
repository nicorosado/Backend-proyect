import { Server } from "socket.io";
import { MessageModel } from '../DAO/mongo/models/messageModel.js';
import { cartService } from "../services/cartService.js";
import { productService } from "../services/productService.js";

export function socketServerHandler(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("A client-socket has connected: " + socket.id);


    socket.on("onFilterChange", async (filterLimit, filterPage, filterSort, filterAttName, filterText,) => {
      try {
        const limit = filterLimit;
        const page = filterPage;
        const filter = filterText;
        const sort = filterSort;
        const attName = filterAttName;
        const products = await productService.getProductsPaginate(limit, page, filter, sort, attName);
        socket.emit("updatedProducts", products);

      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });


    socket.on("addToCart", async (productId, cartId) => {
      try {
        await cartService.addProductToCart(cartId, productId)
        const cartUpdated = await cartService.getProductsByCartId(cartId);
        socketServer.emit("dinamic-list-cart", cartUpdated);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    socket.on("removeFromCart", async (productId, cartId) => {
      try {
        await cartService.deleteProductFromCart(cartId, productId)
        const cartUpdated = await cartService.getProductsByCartId(cartId);
        socketServer.emit("dinamic-list-cart", cartUpdated);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    socket.on("new-product", async (newProd) => {
      try {
        await productService.addProduct({ ...newProd });
        const productsList = await productService.getProductsByOwner(newProd.owner);
        socketServer.emit("products", productsList);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    socket.on("delete-product", async (productId) => {
      try {
        const deletedProduct = await productService.deleteProduct(productId);
        const productsUpdt = await productService.getProductsByOwner(deletedProduct.owner);
        socketServer.emit("products", productsUpdt);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });


    socket.on("message", async (msg) => {
      try {
        await MessageModel.create(msg);
        const msgs = await MessageModel.find();
        socketServer.emit('messageLogs', msgs);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

  });
};
