const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  const { search, category } = req.query;

  try {
    let whereClause = {};

    if (search) {
      whereClause.title = {
        contains: search,
        mode: 'insensitive' // Requires postgres
      };
    }

    if (category) {
      // Find category ID by name
      const cat = await prisma.category.findUnique({
        where: { name: category }
      });
      if (cat) {
        whereClause.categoryId = cat.id;
      } else if (category !== 'All') { // If category is 'All', ignore filter. If valid but missing, maybe don't match
        whereClause.categoryId = 'none'; 
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true
      }
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
