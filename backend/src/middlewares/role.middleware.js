export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`[Role Blocked] Required: [${roles}], Actual: ${req.user?.role || 'NONE'}`);
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

