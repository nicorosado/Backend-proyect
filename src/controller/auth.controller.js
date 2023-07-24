
class AuthController{
    async renderLogin  (req, res) {
        return res.render("login",{})
        }
    async login  (req, res) {
        if (!req.user) {
          return res.json({ error: 'invalid credentials' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role };
      
        return res.redirect("/products")
      }
    async perfil  (req, res)  {
        const user = {email: req.session.user.email,isAdmin: req.session.user.role}
        return res.render("perfil",{user})
        }
    async logut (req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).render("error",{error:"error"})
            }
            return res.redirect("/auth/login")
                })
                // console.log(req?.session?.user,req?.session?.admin)
               }
    async register  (req, res)  {
        if (!req.user) {
          return res.json({ error: 'something went wrong' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role };
        return res.redirect("/products")
      }
    async failRegister  (req, res)  {
        return res.json({ error: 'fail to register' });
      }
    async failLogin  (req, res)  {
        return res.json({ error: 'fail to login' });
      }
    async renderRegister  (req, res) {
        return res.render("register",{})
        }
}

export const authController = new AuthController();