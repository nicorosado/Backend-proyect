import { Router } from 'express';
import { ProductService } from "../services/productService.js"
import { productsController } from '../controllers/productController.js';
import { isAdmin, isLogged, isPremium } from '../middlewares/auth.js';

const routerProd = Router();
const productService = new ProductService;



routerProd.get("/products", productsController.getProducts);
routerProd.get("/productsP", productsController.getProductsPaginate);
routerProd.get('/products/:pid', productsController.getProductById);
routerProd.post("/products/new", productsController.addProduct);
routerProd.put("/products/update/:pid", productsController.updateProduct);
routerProd.delete("/products/delete/:pid", isLogged, isPremium, productsController.deleteProduct);
routerProd.get("/realtimeproducts", isLogged, isPremium, productsController.realtimeproducts);
routerProd.get("/html/products", isLogged, isPremium, productsController.getProductsRender);


export default routerProd;













