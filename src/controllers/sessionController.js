import { UserDTO } from "../DAO/DTO/userDTO.js";

class SessionsController {
  currentSession(req, res) {
    const user = new UserDTO(req.session.user)
    return res.send(JSON.stringify(user));
  }

  dashboard(req, res) {
    req.session.user = req.user;
    return res.redirect('/dashboard');
  }
};

export const sessionsController = new SessionsController();
