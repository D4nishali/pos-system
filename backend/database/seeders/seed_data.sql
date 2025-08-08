-- Insert sample stores
INSERT INTO stores (id, name, address, phone, email) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Main Store', '123 Main Street, City Center', '+1-555-0101', 'main@posstore.com'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Branch Store A', '456 Oak Avenue, Downtown', '+1-555-0102', 'brancha@posstore.com'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Branch Store B', '789 Pine Street, Uptown', '+1-555-0103', 'branchb@posstore.com');

-- Insert sample users (password: 'password123' hashed)
INSERT INTO users (id, name, email, password, role, store_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@pos.com', '$2b$10$9OeZ3kC1mF.oH5Gg7vY8HuXxT8vP2nQ4rS6tU9wV0xY1zA2bC3dD4e', 'admin', NULL),
    ('660e8400-e29b-41d4-a716-446655440002', 'John Cashier', 'john@pos.com', '$2b$10$9OeZ3kC1mF.oH5Gg7vY8HuXxT8vP2nQ4rS6tU9wV0xY1zA2bC3dD4e', 'cashier', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Sarah Manager', 'sarah@pos.com', '$2b$10$9OeZ3kC1mF.oH5Gg7vY8HuXxT8vP2nQ4rS6tU9wV0xY1zA2bC3dD4e', 'manager', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample products
INSERT INTO products (id, name, sku, description, category, price, cost) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Laptop Computer', 'TECH001', 'High-performance laptop for business use', 'Electronics', 899.99, 650.00),
    ('770e8400-e29b-41d4-a716-446655440002', 'Wireless Mouse', 'TECH002', 'Ergonomic wireless mouse', 'Electronics', 29.99, 15.00),
    ('770e8400-e29b-41d4-a716-446655440003', 'Office Chair', 'FURN001', 'Comfortable ergonomic office chair', 'Furniture', 199.99, 120.00),
    ('770e8400-e29b-41d4-a716-446655440004', 'Coffee Maker', 'APPL001', 'Automatic drip coffee maker', 'Appliances', 79.99, 45.00),
    ('770e8400-e29b-41d4-a716-446655440005', 'Notebook Set', 'STAT001', 'Set of 5 premium notebooks', 'Stationery', 12.99, 6.00);

-- Insert sample inventory
INSERT INTO inventory (product_id, store_id, quantity, min_stock, max_stock) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 15, 5, 30),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 45, 10, 100),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 8, 3, 20),
    ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 22, 5, 50),
    ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 100, 20, 200);