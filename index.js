import express from 'express';
import db from './db.js';

const app = express();
const port = 3000;

app.use(express.json());


app.post('/products', (req, res) => {
  const { product_name, product_price } = req.body;
  
  if (!product_name || !product_price) {
    return res.status(400).json({ message: 'Product name and price are required.' });
  }

  const query = 'INSERT INTO products (product_name, product_price) VALUES (?, ?)';
  db.run(query, [product_name, product_price], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error inserting product.', error: err.message });
    }
    res.status(201).json({
      message: 'Product added successfully.',
      product_id: this.lastID,
    });
  });
});

app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching products.', error: err.message });
    }
    res.json(rows);
  });
});


app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { product_name, product_price } = req.body;

  if (!product_name || !product_price) {
    return res.status(400).json({ message: 'Product name and price are required.' });
  }

  const query = 'UPDATE products SET product_name = ?, product_price = ? WHERE product_id = ?';
  
  db.run(query, [product_name, product_price, id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating product.', error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: 'Product updated successfully.' });
  });
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM products WHERE product_id = ?';
  
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting product.', error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: 'Product deleted successfully.' });
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
