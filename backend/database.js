import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'employees.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database tables
export const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          reject(err);
        } else {
          console.log('✅ Users table ready');
        }
      });

      // Create employees table
      db.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          position TEXT NOT NULL,
          department TEXT NOT NULL,
          salary REAL NOT NULL,
          phone TEXT,
          hire_date DATE NOT NULL,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating employees table:', err.message);
          reject(err);
        } else {
          console.log('✅ Employees table ready');
        }
      });

      // Seed default admin user
      db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
        if (err) {
          console.error('Error checking admin user:', err.message);
          reject(err);
        } else if (!row) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          db.run(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            ['admin', hashedPassword, 'admin'],
            (err) => {
              if (err) {
                console.error('Error creating admin user:', err.message);
                reject(err);
              } else {
                console.log('✅ Default admin user created (username: admin, password: admin123)');
                resolve();
              }
            }
          );
        } else {
          console.log('✅ Admin user already exists');
          resolve();
        }
      });
    });
  });
};

export default db;
