const authorize = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || user.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

module.exports = authorize;
