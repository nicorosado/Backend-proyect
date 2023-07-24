import  express  from "express";
 export const usersRouter = express.Router();
import { userController } from "../controller/user.controller.js";

usersRouter.get("/", userController.getAll);
usersRouter.get('/:email', userController.getOnebyEmail);
usersRouter.delete('/:id', userController.deletOne);
usersRouter.put("/:id", userController.updateOne);
