import sqlite3 from 'sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});

const clearCart = () => {
    db.run('DELETE FROM cart', [], (err) => {
        if (err) {
            console.error('Error clearing cart:', err.message);
        } else {
            console.log('Cart cleared successfully.');
        }
        db.close();
    });
};

clearCart();
