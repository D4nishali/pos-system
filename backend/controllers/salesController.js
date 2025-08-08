const { pool } = require('../config/database');

const createSale = async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const { 
            store_id, 
            customer_name, 
            customer_email, 
            items, 
            subtotal, 
            tax_amount, 
            discount_amount, 
            total_amount, 
            payment_method 
        } = req.body;

        // Create sale record
        const saleResult = await client.query(`
            INSERT INTO sales (store_id, user_id, customer_name, customer_email, 
                             subtotal, tax_amount, discount_amount, total_amount, payment_method)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [store_id, req.user.id, customer_name, customer_email, 
            subtotal, tax_amount, discount_amount, total_amount, payment_method]);

        const sale = saleResult.rows[0];

        // Create sale items and update inventory
        for (const item of items) {
            // Insert sale item
            await client.query(`
                INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
                VALUES ($1, $2, $3, $4, $5)
            `, [sale.id, item.product_id, item.quantity, item.unit_price, item.total_price]);

            // Update inventory
            await client.query(`
                UPDATE inventory 
                SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP
                WHERE product_id = $2 AND store_id = $3
            `, [item.quantity, item.product_id, store_id]);
        }

        await client.query('COMMIT');
        
        res.status(201).json({
            message: 'Sale created successfully',
            sale: sale
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create sale error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

const getSales = async (req, res) => {
    try {
        const { store_id, start_date, end_date, limit = 50 } = req.query;
        
        let query = `
            SELECT s.*, st.name as store_name, u.name as cashier_name
            FROM sales s
            JOIN stores st ON s.store_id = st.id
            JOIN users u ON s.user_id = u.id
            WHERE 1=1`;
        
        let params = [];
        let paramCount = 0;

        if (store_id) {
            paramCount++;
            query += ` AND s.store_id = ${paramCount}`;
            params.push(store_id);
        }

        if (start_date) {
            paramCount++;
            query += ` AND s.created_at >= ${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND s.created_at <= ${paramCount}`;
            params.push(end_date);
        }

        query += ` ORDER BY s.created_at DESC LIMIT ${paramCount + 1}`;
        params.push(limit);

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSaleDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const saleResult = await pool.query(`
            SELECT s.*, st.name as store_name, u.name as cashier_name
            FROM sales s
            JOIN stores st ON s.store_id = st.id
            JOIN users u ON s.user_id = u.id
            WHERE s.id = $1
        `, [id]);

        if (saleResult.rows.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const itemsResult = await pool.query(`
            SELECT si.*, p.name as product_name, p.sku
            FROM sale_items si
            JOIN products p ON si.product_id = p.id
            WHERE si.sale_id = $1
        `, [id]);

        res.json({
            sale: saleResult.rows[0],
            items: itemsResult.rows
        });
    } catch (error) {
        console.error('Get sale details error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSale,
    getSales,
    getSaleDetails
};