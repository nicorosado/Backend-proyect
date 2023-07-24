   import  express  from "express";
 export const cartsRouter = express.Router();
import { cartController } from "../controller/carts.controller.js";


 cartsRouter.post('/' ,  cartController.creatCart);
 cartsRouter.post("/:cid/product/:pid" ,  cartController.addProductToCart);
 cartsRouter.delete("/:cid/product/:pid" , cartController.deletOneProductbyCart);
 cartsRouter.get("/:cid" ,  cartController.getById);
 cartsRouter.get("/" , cartController.getCarts);