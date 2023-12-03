// authMiddleware.js

const jwt = require('jsonwebtoken');

const authorize = (requiredRole) => {
  return (req, res, next) => {
    // Assuming you have a user object attached to the request (e.g., from authentication middleware)
    const userRole = req.header("X-User-Role");
    //const userRole = req.user?.role;

    // Check if the user has the required role
    if (userRole === requiredRole) {
      next(); // User has permission, continue to the next middleware or route handler
    } else {
      res.status(403).json({ error: `Unauthorized - User must have role ${requiredRole}` });
    }
  };
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Unauthorized - Invalid token' });
    }
    req.user = user;
    next();
  });
};
module.exports = { authorize, authenticateToken };

  