import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

const ADMIN_EMAIL = "admin@gfxshop.test";
const ADMIN_PASSWORD = "admin123";

const categories = [
  {
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
  },
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
  },
  {
    name: "Apparel",
    slug: "apparel",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
  },
  {
    name: "Home",
    slug: "home",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800",
  },
];

const products = [
  {
    name: "Classic White Sneakers",
    slug: "classic-white-sneakers",
    description:
      "Timeless white sneakers crafted from premium leather. Comfortable cushioning and a versatile design that pairs with any outfit.",
    price: 2499,
    stock: 25,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    ],
    category: "Footwear",
    featured: true,
  },
  {
    name: "Minimalist Leather Wallet",
    slug: "minimalist-leather-wallet",
    description:
      "Slim bifold wallet made from full-grain leather. Holds up to 8 cards and folded cash without bulk.",
    price: 1299,
    stock: 50,
    thumbnail: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=800",
    ],
    category: "Accessories",
    featured: true,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description:
      "Over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
    price: 8999,
    stock: 12,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    ],
    category: "Electronics",
    featured: true,
  },
  {
    name: "Cotton Crewneck T-Shirt",
    slug: "cotton-crewneck-tshirt",
    description:
      "Soft 100% organic cotton t-shirt with a relaxed fit. Pre-shrunk and ready to wear.",
    price: 599,
    stock: 100,
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    category: "Apparel",
    featured: false,
  },
  {
    name: "Stainless Steel Water Bottle",
    slug: "stainless-steel-water-bottle",
    description:
      "Insulated 750ml bottle that keeps drinks cold for 24 hours or hot for 12. BPA-free and leak-proof.",
    price: 899,
    stock: 80,
    thumbnail: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    category: "Lifestyle",
    featured: true,
  },
  {
    name: "Canvas Backpack",
    slug: "canvas-backpack",
    description:
      "Durable waxed canvas backpack with padded laptop sleeve and multiple compartments. Fits 15-inch laptops.",
    price: 3499,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    category: "Accessories",
    featured: false,
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description:
      "Track your heart rate, steps, sleep, and workouts. 7-day battery life and water resistant to 50m.",
    price: 5999,
    stock: 22,
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    category: "Electronics",
    featured: false,
  },
  {
    name: "Aromatic Scented Candle",
    slug: "aromatic-scented-candle",
    description:
      "Hand-poured soy wax candle with essential oils. 50-hour burn time. Notes of sandalwood and vanilla.",
    price: 749,
    stock: 60,
    thumbnail: "https://images.unsplash.com/photo-1602874801006-e26c4e926e34?w=800",
    category: "Home",
    featured: false,
  },
  {
    name: "Ceramic Coffee Mug Set",
    slug: "ceramic-coffee-mug-set",
    description:
      "Set of 4 handcrafted ceramic mugs in earth tones. Microwave and dishwasher safe. 350ml capacity.",
    price: 1199,
    stock: 35,
    thumbnail: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
    category: "Home",
    featured: false,
  },
  {
    name: "Polarized Aviator Sunglasses",
    slug: "polarized-aviator-sunglasses",
    description:
      "Classic aviator frame with polarized lenses for 100% UV protection. Lightweight metal construction.",
    price: 1899,
    stock: 40,
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
    category: "Accessories",
    featured: true,
  },
  {
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    description:
      "Wired mechanical keyboard with hot-swappable switches and per-key RGB lighting. 87-key tenkeyless layout.",
    price: 6499,
    stock: 0,
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    category: "Electronics",
    featured: false,
  },
  {
    name: "Yoga Mat",
    slug: "yoga-mat",
    description:
      "6mm thick non-slip yoga mat with carrying strap. Eco-friendly TPE material, latex-free.",
    price: 1499,
    stock: 28,
    thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    category: "Lifestyle",
    featured: false,
  },
];

const sampleOrders = [
  {
    customerEmail: "rahim@example.com",
    shippingName: "Rahim Ahmed",
    shippingPhone: "01711111111",
    shippingAddress: "House 12, Road 4, Dhanmondi",
    shippingCity: "Dhaka",
    paymentMethod: "bKash",
    phoneNumber: "01711111111",
    transactionId: "TX1A2B3C",
    status: "approved",
    items: [{ slug: "classic-white-sneakers", quantity: 1 }],
  },
  {
    customerEmail: "fatima@example.com",
    shippingName: "Fatima Khan",
    shippingPhone: "01822222222",
    shippingAddress: "Apt 5B, Gulshan 2",
    shippingCity: "Dhaka",
    paymentMethod: "Nagad",
    phoneNumber: "01822222222",
    transactionId: "TX4D5E6F",
    status: "pending",
    items: [
      { slug: "minimalist-leather-wallet", quantity: 2 },
      { slug: "polarized-aviator-sunglasses", quantity: 1 },
    ],
  },
  {
    customerEmail: null,
    shippingName: "Karim Hossain",
    shippingPhone: "01933333333",
    shippingAddress: "Block C, Bashundhara",
    shippingCity: "Dhaka",
    paymentMethod: "Rocket",
    phoneNumber: "01933333333",
    transactionId: "TX7G8H9I",
    status: "pending",
    items: [{ slug: "wireless-noise-cancelling-headphones", quantity: 1 }],
  },
  {
    customerEmail: "nadia@example.com",
    shippingName: "Nadia Islam",
    shippingPhone: "01644444444",
    shippingAddress: "House 22, Sector 7, Uttara",
    shippingCity: "Dhaka",
    paymentMethod: "bKash",
    phoneNumber: "01644444444",
    transactionId: "TXJ1K2L3",
    status: "approved",
    items: [
      { slug: "cotton-crewneck-tshirt", quantity: 3 },
      { slug: "stainless-steel-water-bottle", quantity: 1 },
    ],
  },
  {
    customerEmail: "tareq@example.com",
    shippingName: "Tareq Mahmud",
    shippingPhone: "01555555555",
    shippingAddress: "Plot 18, Mirpur DOHS",
    shippingCity: "Dhaka",
    paymentMethod: "Upay",
    phoneNumber: "01555555555",
    transactionId: "TXM4N5O6",
    status: "rejected",
    items: [{ slug: "smart-fitness-watch", quantity: 1 }],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin user: ${admin.email} / ${ADMIN_PASSWORD}`);

  // Categories
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  const categoryRows = await prisma.category.findMany();
  const categoryByName = new Map(categoryRows.map((c) => [c.name, c]));
  console.log(`✓ Seeded ${categories.length} categories`);

  // Products
  for (const p of products) {
    const { category: categoryName, ...rest } = p;
    const categoryId = categoryName
      ? categoryByName.get(categoryName)?.id ?? null
      : null;
    const data = { ...rest, categoryId };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  console.log(`✓ Seeded ${products.length} products`);

  // Orders — wipe old seed orders first to avoid duplicates
  await prisma.purchase.deleteMany({
    where: { transactionId: { in: sampleOrders.map((o) => o.transactionId) } },
  });

  const productMap = new Map(
    (await prisma.product.findMany()).map((p) => [p.slug, p])
  );

  for (const order of sampleOrders) {
    const itemsData = order.items.map((item) => {
      const product = productMap.get(item.slug);
      if (!product) throw new Error(`Product not found: ${item.slug}`);
      return {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const amount = itemsData.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await prisma.purchase.create({
      data: {
        customerEmail: order.customerEmail,
        amount,
        paymentMethod: order.paymentMethod,
        phoneNumber: order.phoneNumber,
        transactionId: order.transactionId,
        status: order.status,
        shippingName: order.shippingName,
        shippingPhone: order.shippingPhone,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        items: { create: itemsData },
      },
    });
  }
  console.log(`✓ Seeded ${sampleOrders.length} sample orders`);

  console.log("✅ Done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
