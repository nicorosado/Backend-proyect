import { Router } from 'express';
import { ticketsController } from '../controllers/ticketController.js';
import { isLogged, isUser } from '../middlewares/auth.js';
//--

const routerTicket = Router();

routerTicket.get("/checkout", isLogged, ticketsController.checkOut);
routerTicket.get("/finishticket", isLogged, ticketsController.addTicket);

export default routerTicket;