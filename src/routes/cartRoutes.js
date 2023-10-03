import { Router } from 'express';
import { cartsController } from '../controllers/cartController.js';
import { isLogged, isUser } from '../middlewares/auth.js';
//--

const routerCart = Router();

routerCart.get("/carts", cartsController.getCarts);
routerCart.get('/carts/:cid', cartsController.getProductsByCartId);
routerCart.put('/carts/new', cartsController.addCart);
routerCart.put('/carts/:cid/product/:pid', cartsController.addProductToCart);
routerCart.delete('/carts/delete/:cid/product/:pid', cartsController.deleteProductFromCart);
routerCart.delete('/carts/empty/:cid', cartsController.emptyCart);
routerCart.delete('/carts/deleteAll/:cid', cartsController.deleteCart);
routerCart.get("/carts/products/:cid", cartsController.getProductsByCartId_Handlebars);
routerCart.get("/store", isLogged, cartsController.getProductsByCartId_Paginate);

export default routerCart;