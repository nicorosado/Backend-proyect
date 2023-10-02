import { Router } from 'express';
import { chatsController } from '../controllers/chatController.js';
import { isLogged, isUser } from '../middlewares/auth.js';
//--

const routerChat = Router();

routerChat.get("/chat", isLogged, isUser, chatsController.chats);

export default routerChat;