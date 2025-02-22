import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// (Optional) Create tables if not exist – not production-ready, just demo
const createTables = async () => {
  try {
    // Create "users" table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Create "tasks" table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        "isComplete" BOOLEAN DEFAULT FALSE,
        "userId" INTEGER,
        CONSTRAINT fk_user
          FOREIGN KEY("userId") 
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    console.log('Database tables created (if they did not exist).');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Call the table creation on startup
createTables();