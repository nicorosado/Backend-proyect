import  express  from "express";
 export const prodructsRouter = express.Router();
import { uploader } from "../utils.js";
import { productsController } from "../controller/products.controller.js";

//GET = OBTENER TODOS
prodructsRouter.get("/", productsController.getAll);
//GET = OBTENER POR ID
prodructsRouter.get('/:id', productsController.getbyId);
//POST = CREAR
prodructsRouter.post('/', uploader.single('thumbnail') ,  productsController.createOne);
//PUT = MODIFICAR
prodructsRouter.put('/:id', productsController.updateOne);
//ELIMINAR
prodructsRouter.delete('/:id', productsController.deletOne);


