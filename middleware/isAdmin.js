// Middleware pour vérifier si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({
    message: "Vous devez être connecté pour accéder à cette ressource.",
  })
}

// Middleware pour vérifier si l'utilisateur est administrateur
function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next()
  }
  res
    .status(403)
    .json({ message: "Vous n'êtes pas autorisé à accéder à cette ressource." })
}

// Middleware combiné pour vérifier si l'utilisateur est authentifié et administrateur
function isAuthenticatedAndAdmin(req, res, next) {
  isAuthenticated(req, res, function () {
    isAdmin(req, res, next)
  })
}

module.exports = { isAuthenticated, isAdmin, isAuthenticatedAndAdmin }
