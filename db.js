import sqlite3 from 'sqlite3';


const db = new sqlite3.Database('./mydb.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected!');
  }
});


db.run(`
  CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    product_price REAL NOT NULL
  )
`);

export default db;
