import  express  from "express";
 export const authRouter = express.Router();
import { isUser } from "../middleware/auth.js";
import passport from "passport";
import { authController } from "../controller/auth.controller.js";

authRouter.get("/login", authController.renderLogin);

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }),authController.login);
 
authRouter.get("/perfil",isUser, authController.perfil);
    
authRouter.get('/logout', authController.logut)

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), authController.register);
          
authRouter.get('/failregister', authController.failRegister);

authRouter.get('/faillogin', authController.failLogin);
          
authRouter.get("/register", authController.renderRegister);
