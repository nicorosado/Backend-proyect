import { Router } from 'express';
import { chatsController } from '../controllers/chatController.js';
import { isLogged } from '../middlewares/auth.js';

const routerChat = Router();

routerChat.get("/chat", isLogged, chatsController.chats);

export default routerChat;