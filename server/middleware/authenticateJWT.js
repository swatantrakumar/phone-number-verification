const jwt = require('jsonwebtoken');
const secretKey  = process.env.KEY;

function authenticateJWT(req, res, next) {
    // const token = req.headers.authorization;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token is required' });
    }
}

module.exports = authenticateJWT;