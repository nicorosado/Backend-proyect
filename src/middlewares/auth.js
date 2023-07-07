/* eslint-disable space-before-function-paren */
export function isUser(req, res, next) {
  if (req.session?.user?.email) {
    return next()
  } else if (req.session?.passport?.user) {
    return next()
  }
  return res.status(401).render('error', { error: 'error de autenticacion!' })
}

export function isAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    return next()
  }
  return res.status(403).render('error', { error: 'error de autorización!' })
}
