import  express  from "express";
export const viewsRouter = express.Router();
import { viewsController } from "../controller/views.controller.js";


viewsRouter.get('/products', viewsController.getAll);

viewsRouter.get("/cart/:cid" ,  viewsController.getCardbyId)

viewsRouter.get("/show-session" , viewsController.showSession )

viewsRouter.get('/logout', viewsController.logout)

              
  
  
