const { pool } = require('../config/database');

const getInventory = async (req, res) => {
    try {
        const { store_id } = req.query;
        
        let query = `
            SELECT 
                i.*,
                p.name as product_name,
                p.sku,
                p.category,
                p.price,
                s.name as store_name,
                CASE 
                    WHEN i.quantity <= i.min_stock THEN 'Low Stock'
                    WHEN i.quantity = 0 THEN 'Out of Stock'
                    ELSE 'In Stock'
                END as status
            FROM inventory i
            JOIN products p ON i.product_id = p.id
            JOIN stores s ON i.store_id = s.id
            WHERE p.is_active = true`;
        
        let params = [];

        if (store_id) {
            query += ' AND i.store_id = $1';
            params.push(store_id);
        }

        query += ' ORDER BY p.name';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateInventory = async (req, res) => {
    try {
        const { product_id, store_id, quantity, min_stock, max_stock } = req.body;

        const result = await pool.query(`
            INSERT INTO inventory (product_id, store_id, quantity, min_stock, max_stock)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (product_id, store_id)
            DO UPDATE SET 
                quantity = $3,
                min_stock = $4,
                max_stock = $5,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [product_id, store_id, quantity, min_stock, max_stock]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getLowStockItems = async (req, res) => {
    try {
        const { store_id } = req.query;
        
        let query = `
            SELECT 
                i.*,
                p.name as product_name,
                p.sku,
                s.name as store_name
            FROM inventory i
            JOIN products p ON i.product_id = p.id
            JOIN stores s ON i.store_id = s.id
            WHERE i.quantity <= i.min_stock AND p.is_active = true`;
        
        let params = [];

        if (store_id) {
            query += ' AND i.store_id = $1';
            params.push(store_id);
        }

        query += ' ORDER BY (i.quantity::float / i.min_stock::float) ASC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get low stock error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getInventory,
    updateInventory,
    getLowStockItems
};