const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultUserEmail = "default@amazon.com";

async function main() {
  console.log('Start seeding...');

  // 1. Create a Default User
  let user = await prisma.user.findUnique({
    where: { email: defaultUserEmail }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Default User",
        email: defaultUserEmail,
        cart: {
          create: {}
        }
      }
    });
    console.log(`Created default user: ${user.name}`);
  } else {
    console.log(`Default user already exists`);
  }

  // 2. Clear existing categories and products (optional, for clean slate)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.cartItem.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();

  // 3. Create Categories
  const categoriesData = [
    "Electronics",
    "Fashion",
    "Home",
    "Books",
    "Toys"
  ];
  
  const createdCategories = {};

  for (const name of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    createdCategories[name] = category.id;
    console.log(`Created/Ensured category: ${name}`);
  }

  // 4. Create Products
  const productsData = [
    // Electronics
    { title: "Wireless Noise Cancelling Headphones", description: "Premium noise cancelling headphones with 30-hour battery life.", price: 299.99, stock: 50, categoryId: createdCategories["Electronics"], images: ["https://picsum.photos/seed/elec1/400/400"] },
    { title: "4K Ultra HD Smart TV", description: "55-Inch 4K Smart TV with vibrant colors and built-in streaming apps.", price: 599.99, stock: 20, categoryId: createdCategories["Electronics"], images: ["https://picsum.photos/seed/elec2/400/400"] },
    { title: "Smartphone 128GB", description: "Latest generation smartphone with brilliant OLED display.", price: 799.00, stock: 35, categoryId: createdCategories["Electronics"], images: ["https://picsum.photos/seed/elec3/400/400"] },
    { title: "Gaming Laptop", description: "High-performance gaming laptop with RTX graphics.", price: 1299.99, stock: 15, categoryId: createdCategories["Electronics"], images: ["https://picsum.photos/seed/elec4/400/400"] },
    
    // Fashion
    { title: "Men's Cotton T-Shirt", description: "Comfortable and breathable cotton tee suitable for daily wear.", price: 19.99, stock: 100, categoryId: createdCategories["Fashion"], images: ["https://picsum.photos/seed/fash1/400/400"] },
    { title: "Women's Denim Jacket", description: "Classic denim jacket with a relaxed fit.", price: 49.99, stock: 60, categoryId: createdCategories["Fashion"], images: ["https://picsum.photos/seed/fash2/400/400"] },
    { title: "Running Shoes", description: "Lightweight running shoes with superior cushioning.", price: 89.99, stock: 80, categoryId: createdCategories["Fashion"], images: ["https://picsum.photos/seed/fash3/400/400"] },
    { title: "Leather Wallet", description: "Genuine leather bifold wallet with multiple card slots.", price: 29.99, stock: 150, categoryId: createdCategories["Fashion"], images: ["https://picsum.photos/seed/fash4/400/400"] },

    // Home
    { title: "Non-Stick Cookware Set", description: "12-piece non-stick pots and pans set.", price: 89.99, stock: 40, categoryId: createdCategories["Home"], images: ["https://picsum.photos/seed/home1/400/400"] },
    { title: "Robot Vacuum Cleaner", description: "Smart robot vacuum with wi-fi connectivity and powerful suction.", price: 199.99, stock: 25, categoryId: createdCategories["Home"], images: ["https://picsum.photos/seed/home2/400/400"] },
    { title: "Memory Foam Pillow", description: "Ergonomic memory foam pillow for neck support.", price: 34.99, stock: 75, categoryId: createdCategories["Home"], images: ["https://picsum.photos/seed/home3/400/400"] },
    { title: "Cotton Bath Towels", description: "Set of 4 plush, absorbent 100% cotton bath towels.", price: 39.99, stock: 120, categoryId: createdCategories["Home"], images: ["https://picsum.photos/seed/home4/400/400"] },

    // Books
    { title: "The Pragmatic Programmer", description: "Your journey to mastery in software development.", price: 45.00, stock: 40, categoryId: createdCategories["Books"], images: ["https://picsum.photos/seed/book1/400/400"] },
    { title: "Clean Code", description: "A handbook of agile software craftsmanship.", price: 50.00, stock: 35, categoryId: createdCategories["Books"], images: ["https://picsum.photos/seed/book2/400/400"] },
    { title: "Design Patterns", description: "Elements of reusable object-oriented software.", price: 55.00, stock: 20, categoryId: createdCategories["Books"], images: ["https://picsum.photos/seed/book3/400/400"] },
    { title: "Atomic Habits", description: "An easy & proven way to build good habits & break bad ones.", price: 16.99, stock: 200, categoryId: createdCategories["Books"], images: ["https://picsum.photos/seed/book4/400/400"] },

    // Toys
    { title: "Building Blocks Set", description: "1000-piece creative building blocks for kids.", price: 24.99, stock: 80, categoryId: createdCategories["Toys"], images: ["https://picsum.photos/seed/toys1/400/400"] },
    { title: "RC Car", description: "High-speed remote control car with rechargeable battery.", price: 39.99, stock: 45, categoryId: createdCategories["Toys"], images: ["https://picsum.photos/seed/toys2/400/400"] },
    { title: "Plush Bear", description: "Large, soft, and cuddly teddy bear.", price: 19.99, stock: 150, categoryId: createdCategories["Toys"], images: ["https://picsum.photos/seed/toys3/400/400"] },
    { title: "Board Game", description: "Strategic family board game for 2-6 players.", price: 29.99, stock: 60, categoryId: createdCategories["Toys"], images: ["https://picsum.photos/seed/toys4/400/400"] }
  ];

  for (const p of productsData) {
    const existing = await prisma.product.findFirst({ where: { title: p.title } });
    if (!existing) {
      await prisma.product.create({
        data: p
      });
      console.log(`Created product: ${p.title}`);
    } else {
      console.log(`Product already exists: ${p.title}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
