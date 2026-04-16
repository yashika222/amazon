const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

const DEFAULT_USER_EMAIL = 'default@amazon.com';

// Helper to get default user
async function getDefaultUser() {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL }, include: { cart: true } });
  return user;
}

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const user = await getDefaultUser();
    if (!user || !user.cart) return res.status(404).json({ error: 'Cart not found' });

    const cartData = await prisma.cart.findUnique({
      where: { id: user.cart.id },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: {
            id: 'asc'
          }
        }
      }
    });

    res.json(cartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart/add
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await getDefaultUser();
    if (!user || !user.cart) return res.status(404).json({ error: 'Cart not found' });

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: user.cart.id,
        productId: productId
      }
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: user.cart.id,
          productId: productId,
          quantity: quantity || 1
        }
      });
    }

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// PUT /api/cart/update
router.put('/update', async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;
    
    if (quantity <= 0) {
      // remove instead
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return res.json({ success: true, removed: true });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/remove
router.delete('/remove', async (req, res) => {
  try {
    const { cartItemId } = req.body;
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

module.exports = router;
