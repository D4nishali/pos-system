const { verifyToken } = require('../config/auth');
const { pool } = require('../config/database');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = verifyToken(token);
        const result = await pool.query('SELECT * FROM users WHERE id = $1 AND is_active = true', [decoded.userId]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { authenticate };