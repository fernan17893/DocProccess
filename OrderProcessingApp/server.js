const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors())

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'fern', // Replace with your MySQL password
  database: 'orderprocessing'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Create a new orders
app.post('/orders', (req, res) => {
    console.log('Received POST request to /orders');
    console.log('Request body:', req.body);
    
  
    const { customer_name, product, quantity, order_date, status } = req.body.orders[0];
    
    if (!customer_name || !product || !quantity || !order_date || !status) {
      res.status(400).json('All fields are required');
      return;
    }
  
    const query = 'INSERT INTO orders (customer_name, product, quantity, order_date, status) VALUES (?, ?, ?, ?, ?)';
    const values = [customer_name, product, quantity, order_date, status];
  
    db.query(query, values, (error) => {
      if (error) {
        console.error('Error inserting order:', error);
        res.status(500).json('Error inserting order');
        return;
      }
      res.status(200).json('Order added successfully');
    });
  });

// Read all orders
app.get('/orders', (req, res) => {
    db.query('SELECT * FROM orders', (error, results) => {
      if (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
        return;
      }
      res.json(results);
    });
  });

// Update an order
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { customer_name, product, quantity, order_date, status } = req.body;
  const query = 'UPDATE Orders SET customer_name = ?, product = ?, quantity = ?, order_date = ?, status = ? WHERE order_id = ?';
  db.query(query, [customer_name, product, quantity, order_date, status, id], (err, result) => {
    if (err) {
      console.error('Error updating order:', err);
      res.status(500).send('Error updating order');
      return;
    }
    res.status(200).send('Order updated successfully');
  });
});

// Delete an order
app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Orders WHERE order_id = ?';
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting order:', err);
        res.status(500).send('Error deleting order');
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send('Order not found');
        return;
      }
      res.status(200).send('Order deleted successfully');
    });
  });
  

// Set up a basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Order Processing App!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
