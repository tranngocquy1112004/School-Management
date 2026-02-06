const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.split(' ')[1];
    const cookieToken = req.cookies && req.cookies.token;
    const token = headerToken || cookieToken;
    if (!token) return res.status(401).json({ message: 'Token missing' });

    try {
        const secret = process.env.SECRET_KEY || 'secret_key_default';
        const payload = jwt.verify(token, secret);
        // payload should contain id, role, school
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = auth;
