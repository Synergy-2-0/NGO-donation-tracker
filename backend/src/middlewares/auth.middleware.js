import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id, role}
    
    // Explicitly add a fallback to req.userId for legacy controller compatibility
    req.userId = decoded.id; 
    
    console.info(`[Auth Middleware] Authenticated User: ${decoded.id} | Role: ${decoded.role}`);
    next();
  } catch (error) {
    console.error('[Auth Error] Token verification failed:', error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const protect = authenticate;

export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) return res.status(403).json({ message: "Forbidden" });
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };

   
};
