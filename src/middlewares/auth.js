export function isLogged(req, res, next) {
  if (req.session && req.session.user && req.session.user.email) {
    next();
  } else {
    res.status(401).render('error', { error: 'Must be logged to access' });
  }
}

export function isUser(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'user') {
    next();
  } else {
    res.status(401).render('error', { error: 'Authorization error' });
  }
}

export function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).render('error', { error: 'Must be an admin' });
  }
}

export function isPremium(req, res, next) {
  if (
    (req.session && req.session.user && req.session.user.isPremium) ||
    (req.session && req.session.user && req.session.user.role === 'admin')
  ) {
    next();
  } else {
    res.status(403).render('error', { error: 'Must be Premium User' });
  }
}
