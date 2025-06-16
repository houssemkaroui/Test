exports.checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
  
  exports.checkOwnership = (model, paramName) => async (req, res, next) => {
    const doc = await model.findById(req.params[paramName]);
    if (!doc) return res.status(404).json({ message: 'Non trouvé' });
    
    if (req.user.role === 'admin') return next();
    if (doc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };