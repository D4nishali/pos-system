const { pool } = require('../config/database');

const getStores = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.*,
                u.name as manager_name,
                COUNT(DISTINCT us.id) as staff_count,
                COALESCE(SUM(sa.total_amount), 0) as total_sales
            FROM stores s
            LEFT JOIN users u ON s.manager_id = u.id
            LEFT JOIN users us ON us.store_id = s.id
            LEFT JOIN sales sa ON sa.store_id = s.id AND sa.created_at >= CURRENT_DATE
            WHERE s.is_active = true
            GROUP BY s.id, u.name
            ORDER BY s.name
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createStore = async (req, res) => {
    try {
        const { name, address, phone, email, manager_id } = req.body;

        const result = await pool.query(`
            INSERT INTO stores (name, address, phone, email, manager_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [name, address, phone, email, manager_id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create store error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getStores,
    createStore
};