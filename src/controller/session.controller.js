
class SessionController{
  async registerGithub (req, res)  {
    req.session.user = req.user;
    // Successful authentication, redirect home.
    res.redirect('/products');
  }
  async showSession (req, res)  {
    return res.send(JSON.stringify(req.session.user.firstName));
  }
}

export const sessionController = new SessionController();