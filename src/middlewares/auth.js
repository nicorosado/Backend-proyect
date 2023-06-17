/* eslint-disable space-before-function-paren */
export function isUser(req, res, next) {
  if (req.session?.email) {
    return next()
  }
  return res.status(401).render('error', { error: 'error de autenticacion!' })
}

export function isAdmin(req, res, next) {
  if (req.session?.isAdmin) {
    return next()
  }
  return res.status(403).render('error', { error: 'error de autorización!' })
}
