const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

const DEFAULT_USER_EMAIL = 'default@amazon.com';

async function getDefaultUser() {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL }, include: { cart: { include: { items: { include: { product: true } } } } } });
  return user;
}

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { address, city, state, pincode, phone } = req.body;
    const user = await getDefaultUser();

    if (!user || !user.cart) return res.status(400).json({ error: 'User or Cart not found' });
    const cartItems = user.cart.items;

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const createOrderItems = [];

    for (const item of cartItems) {
      totalAmount += item.product.price * item.quantity;
      createOrderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      });
    }

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        address,
        city,
        state,
        pincode,
        phone,
        items: {
          create: createOrderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: user.cart.id }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

module.exports = router;
