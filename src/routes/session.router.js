import passport from 'passport';
import express from 'express';
import { sessionController } from '../controller/session.controller.js';
export const sessionsRouter = express.Router();

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionController.registerGithub);

sessionsRouter.get('/show', sessionController.showSession);
