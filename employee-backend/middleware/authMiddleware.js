const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
   const tokenParts = token.split(' ');

   try {
    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
   } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
   }
}

module.exports = verifyToken;