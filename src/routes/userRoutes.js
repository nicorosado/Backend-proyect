import express from 'express';
import { usersController } from '../controllers/userController.js';
import { isAdmin, isLogged } from '../middlewares/auth.js';

const userRouter = express.Router();
userRouter.get('/api/users', isLogged, isAdmin, usersController.getUsers);
userRouter.delete('/api/users', isLogged, isAdmin, usersController.deleteInactiveUsers);
export default userRouter;