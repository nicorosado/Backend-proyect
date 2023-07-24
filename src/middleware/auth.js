// Medialware Admin
export function isUser(req, res, next) {
  if (req?.session?.user?.email) {
    return next()
  }
  return res.status(500).render("error", { error: "no esta registrado" })
}

export function isAdmin(req, res, next) {
  if (req?.session?.admin) {
    return next()
  }
  return res.status(500).render("error", { error: "No es Admin" })
} 