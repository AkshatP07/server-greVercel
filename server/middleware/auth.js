const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.id; // Set user ID for the request
        next();
    });
};


module.exports = { authenticate };
