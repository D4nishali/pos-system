const { pool } = require('../config/database');

const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = 'SELECT * FROM products WHERE is_active = true';
        let params = [];

        if (category) {
            query += ' AND category = $1';
            params.push(category);
        }

        if (search) {
            const searchParam = `%${search}%`;
            if (params.length > 0) {
                query += ' AND (name ILIKE $2 OR sku ILIKE $2)';
            } else {
                query += ' AND (name ILIKE $1 OR sku ILIKE $1)';
            }
            params.push(searchParam);
        }

        query += ' ORDER BY name';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, sku, description, category, price, cost, image_url } = req.body;

        const result = await pool.query(`
            INSERT INTO products (name, sku, description, category, price, cost, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `, [name, sku, description, category, price, cost, image_url]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'SKU already exists' });
        }
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, description, category, price, cost, image_url } = req.body;

        const result = await pool.query(`
            UPDATE products 
            SET name = $1, sku = $2, description = $3, category = $4, 
                price = $5, cost = $6, image_url = $7, updated_at = CURRENT_TIMESTAMP
            WHERE id = $8 
            RETURNING *
        `, [name, sku, description, category, price, cost, image_url, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'UPDATE products SET is_active = false WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};