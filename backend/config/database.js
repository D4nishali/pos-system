const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function connectDB() {
    try {
        await pool.connect();
        console.log('PostgreSQL connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

async function migrate() {
    const migrationDir = path.join(__dirname, '../database/migrations');
    const files = fs.readdirSync(migrationDir).sort();
    
    for (const file of files) {
        if (file.endsWith('.sql')) {
            console.log(`Running migration: ${file}`);
            const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
            await pool.query(sql);
        }
    }
    console.log('Migrations completed');
}

async function seed() {
    const seedFile = path.join(__dirname, '../database/seeders/seed_data.sql');
    const sql = fs.readFileSync(seedFile, 'utf8');
    await pool.query(sql);
    console.log('Seed data inserted');
}

module.exports = { pool, connectDB, migrate, seed };