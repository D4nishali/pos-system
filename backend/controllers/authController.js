const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../config/auth');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user with store information
        const result = await pool.query(`
            SELECT u.*, s.name as store_name 
            FROM users u 
            LEFT JOIN stores s ON u.store_id = s.id 
            WHERE u.email = $1 AND u.is_active = true
        `, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ userId: user.id, role: user.role });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                store_id: user.store_id,
                store_name: user.store_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, role, store_id } = req.body;

        // Check if user exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await pool.query(`
            INSERT INTO users (name, email, password, role, store_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, name, email, role, store_id
        `, [name, email, hashedPassword, role, store_id]);

        const user = result.rows[0];
        const token = generateToken({ userId: user.id, role: user.role });

        res.status(201).json({
            token,
            user
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login, register };