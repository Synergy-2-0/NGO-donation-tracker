import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id, role}
    req.userId = decoded.id; 
    
    console.info(`[Auth Middleware] Authenticated User: ${decoded.id} | Role: ${decoded.role}`);
    next();
  } catch (error) {
    console.error('[Auth Error] Token verification failed:', error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const optionalAuthenticate = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next();
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.id;
        next();
    } catch (error) {
        next();
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
