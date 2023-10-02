import express from 'express';
import passport from 'passport';
import { isAdmin, isLogged } from '../middlewares/auth.js';
import { usersController } from '../controllers/userController.js';

const authRouter = express.Router();

// Register
authRouter.get('/auth/register', usersController.register);
authRouter.post('/auth/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), usersController.registerPassport);
authRouter.get('/auth/failregister', usersController.registerFail);

// Login
authRouter.get('/auth/login', usersController.login);
authRouter.post('/auth/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), usersController.loginPassport);
authRouter.get('/auth/faillogin', usersController.loginFail);

// Logout
authRouter.get('/auth/logout', isLogged, usersController.logOut);

// Perfil de Usuario
authRouter.get('/auth/profile', isLogged, usersController.profile);
// Panel de Administración (accesible solo para usuarios con rol de admin e isAdmin = true)

// Dashboard
authRouter.get('/dashboard', isLogged, usersController.dashboard);

// Entrega 15 - 3er Practica integradora endpoint cambio premium en usuario
authRouter.get('/api/users/premium/:uid', isLogged, usersController.changePremiumUser);




//TESTING
// authRouter.get('/users', usersController.getUsers);
// authRouter.get('/users/:uid', usersController.getUserById);
// authRouter.delete('/users/:uid', usersController.deleteUser);

export default authRouter;