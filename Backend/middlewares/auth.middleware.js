// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Supprimer "Bearer " du token si présent
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const decoded = jwt.verify(actualToken, 'YOUR_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;