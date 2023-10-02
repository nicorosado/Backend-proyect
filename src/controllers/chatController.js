class ChatsController {
  async chats(req, res) {
    try {
      res.status(200).render('chat', {});
    } catch (err) {
      res.status(500).json({ Error: `${err}` });
    };
  };
};

export const chatsController = new ChatsController();
