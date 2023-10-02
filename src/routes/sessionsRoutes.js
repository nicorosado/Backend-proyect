import { Router } from 'express';
import passport from 'passport';
import { sessionsController } from '../controllers/sessionController.js';
//---

export const sessionRoutes = Router();

sessionRoutes.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));
sessionRoutes.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionsController.dashboard);


sessionRoutes.get('/api/sessions/current', sessionsController.currentSession);

export default sessionRoutes;