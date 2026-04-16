require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
