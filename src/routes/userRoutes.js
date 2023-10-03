import express from 'express';
import { usersController } from '../controllers/userController.js';
import { isAdmin, isLogged } from '../middlewares/auth.js';

const userRouter = express.Router();
userRouter.get('/api/users', isLogged, isAdmin, usersController.getUsers);
userRouter.post('/api/user/changeRole/:uid', isLogged, isAdmin, usersController.changeUserRole);
userRouter.delete('/api/users', isLogged, isAdmin, usersController.deleteInactiveUsers);
userRouter.delete('/api/user/:uid', isLogged, isAdmin, usersController.deleteUser);



export default userRouter;