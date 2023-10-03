import express from 'express';
import passport from 'passport';
import { isAdmin, isLogged } from '../middlewares/auth.js';
import { usersController } from '../controllers/userController.js';

const authRouter = express.Router();

authRouter.get('/auth/register', usersController.register);
authRouter.post('/auth/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), usersController.registerPassport);
authRouter.get('/auth/failregister', usersController.registerFail);

authRouter.get('/auth/login', usersController.login);
authRouter.post('/auth/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), usersController.loginPassport);
authRouter.get('/auth/faillogin', usersController.loginFail);

authRouter.get('/auth/logout', isLogged, usersController.logOut);

authRouter.get('/auth/profile', isLogged, usersController.profile);

authRouter.get('/dashboard', isLogged, usersController.dashboard);

authRouter.get('/api/users/premium/:uid', isLogged, usersController.changePremiumUser);

export default authRouter;