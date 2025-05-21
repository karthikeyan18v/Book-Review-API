const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from the "Authorization" header in the format "Bearer <token>"
  const token = req.header('Authorization')?.split(' ')[1];

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the secret stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID to the request object for downstream handlers
    req.user = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, respond with "unauthorized"
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
