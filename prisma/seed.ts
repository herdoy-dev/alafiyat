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

// Helper: random date within last N days
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  );
  return d;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const sampleOrders = [
  // Original 5 orders
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
    daysAgo: 2,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "spring_sale",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
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
    daysAgo: 1,
    utmSource: "google",
    utmMedium: "organic",
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
    daysAgo: 0,
    utmSource: "tiktok",
    utmMedium: "cpc",
    utmCampaign: "headphones_promo",
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
    daysAgo: 5,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "spring_sale",
    courierProvider: "Steadfast",
    courierStatus: "in_transit",
    courierSentAt: true,
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
    daysAgo: 3,
  },
  // 20+ more orders with variety
  {
    customerEmail: "arif@example.com",
    shippingName: "Arif Rahman",
    shippingPhone: "01766666666",
    shippingAddress: "House 5, Mirpur 10",
    shippingCity: "Dhaka",
    paymentMethod: "bKash",
    phoneNumber: "01766666666",
    transactionId: "TXP1Q2R3",
    status: "approved",
    items: [{ slug: "canvas-backpack", quantity: 1 }],
    daysAgo: 7,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "backpack_ad",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "sabrina@example.com",
    shippingName: "Sabrina Akter",
    shippingPhone: "01877777777",
    shippingAddress: "Road 12, Banani",
    shippingCity: "Dhaka",
    paymentMethod: "Nagad",
    phoneNumber: "01877777777",
    transactionId: "TXS4T5U6",
    status: "approved",
    items: [
      { slug: "aromatic-scented-candle", quantity: 2 },
      { slug: "ceramic-coffee-mug-set", quantity: 1 },
    ],
    daysAgo: 4,
    utmSource: "instagram",
    utmMedium: "social",
    utmCampaign: "home_decor",
    courierProvider: "Steadfast",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "zahid@example.com",
    shippingName: "Zahid Hasan",
    shippingPhone: "01988888888",
    shippingAddress: "Agrabad, Near Port",
    shippingCity: "Chittagong",
    paymentMethod: "bKash",
    phoneNumber: "01988888888",
    transactionId: "TXV7W8X9",
    status: "approved",
    items: [{ slug: "smart-fitness-watch", quantity: 1 }],
    daysAgo: 10,
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "fitness_watch",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "mim@example.com",
    shippingName: "Mim Sultana",
    shippingPhone: "01611111122",
    shippingAddress: "Shahbag, Near TSC",
    shippingCity: "Dhaka",
    paymentMethod: "Cash on Delivery",
    phoneNumber: "",
    transactionId: "",
    status: "approved",
    items: [
      { slug: "yoga-mat", quantity: 1 },
      { slug: "stainless-steel-water-bottle", quantity: 2 },
    ],
    daysAgo: 6,
    courierProvider: "Steadfast",
    courierStatus: "picked_up",
    courierSentAt: true,
  },
  {
    customerEmail: "rubel@example.com",
    shippingName: "Rubel Mia",
    shippingPhone: "01722222233",
    shippingAddress: "Station Road",
    shippingCity: "Sylhet",
    paymentMethod: "Nagad",
    phoneNumber: "01722222233",
    transactionId: "TXRUB123",
    status: "approved",
    items: [{ slug: "wireless-noise-cancelling-headphones", quantity: 1 }],
    daysAgo: 12,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "headphones_promo",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "luna@example.com",
    shippingName: "Luna Begum",
    shippingPhone: "01833333344",
    shippingAddress: "College Road",
    shippingCity: "Rajshahi",
    paymentMethod: "bKash",
    phoneNumber: "01833333344",
    transactionId: "TXLUNA01",
    status: "approved",
    items: [
      { slug: "classic-white-sneakers", quantity: 1 },
      { slug: "cotton-crewneck-tshirt", quantity: 2 },
    ],
    daysAgo: 8,
    utmSource: "tiktok",
    utmMedium: "cpc",
    utmCampaign: "sneakers_tiktok",
    courierProvider: "Steadfast",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "farhan@example.com",
    shippingName: "Farhan Chowdhury",
    shippingPhone: "01944444455",
    shippingAddress: "Kazir Dewri",
    shippingCity: "Chittagong",
    paymentMethod: "Rocket",
    phoneNumber: "01944444455",
    transactionId: "TXFAR001",
    status: "pending",
    items: [{ slug: "mechanical-keyboard", quantity: 1 }],
    daysAgo: 1,
    utmSource: "google",
    utmMedium: "organic",
  },
  {
    customerEmail: "tasnim@example.com",
    shippingName: "Tasnim Rahman",
    shippingPhone: "01655555566",
    shippingAddress: "New Market Area",
    shippingCity: "Dhaka",
    paymentMethod: "Cash on Delivery",
    phoneNumber: "",
    transactionId: "",
    status: "approved",
    items: [
      { slug: "polarized-aviator-sunglasses", quantity: 1 },
      { slug: "minimalist-leather-wallet", quantity: 1 },
    ],
    daysAgo: 15,
    utmSource: "instagram",
    utmMedium: "social",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "sakib@example.com",
    shippingName: "Sakib Al Hasan",
    shippingPhone: "01766666677",
    shippingAddress: "Tongi, Gazipur",
    shippingCity: "Gazipur",
    paymentMethod: "bKash",
    phoneNumber: "01766666677",
    transactionId: "TXSAK001",
    status: "approved",
    items: [{ slug: "classic-white-sneakers", quantity: 2 }],
    daysAgo: 20,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "spring_sale",
    courierProvider: "Steadfast",
    courierStatus: "delivered",
    courierSentAt: true,
    discountCode: "WELCOME10",
    discountAmount: 500,
  },
  {
    customerEmail: "jui@example.com",
    shippingName: "Jui Akter",
    shippingPhone: "01877777788",
    shippingAddress: "Nawabpur Road",
    shippingCity: "Dhaka",
    paymentMethod: "Nagad",
    phoneNumber: "01877777788",
    transactionId: "TXJUI001",
    status: "approved",
    items: [
      { slug: "aromatic-scented-candle", quantity: 3 },
      { slug: "yoga-mat", quantity: 1 },
    ],
    daysAgo: 3,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "home_decor",
    courierProvider: "Pathao",
    courierStatus: "in_transit",
    courierSentAt: true,
  },
  {
    customerEmail: "mahfuz@example.com",
    shippingName: "Mahfuz Alam",
    shippingPhone: "01988888899",
    shippingAddress: "Savar, EPZ Road",
    shippingCity: "Savar",
    paymentMethod: "bKash",
    phoneNumber: "01988888899",
    transactionId: "TXMAH001",
    status: "rejected",
    items: [{ slug: "smart-fitness-watch", quantity: 1 }],
    daysAgo: 11,
    utmSource: "google",
    utmMedium: "cpc",
  },
  {
    customerEmail: "priya@example.com",
    shippingName: "Priya Das",
    shippingPhone: "01611111133",
    shippingAddress: "Lalkhan Bazar",
    shippingCity: "Chittagong",
    paymentMethod: "Cash on Delivery",
    phoneNumber: "",
    transactionId: "",
    status: "approved",
    items: [
      { slug: "ceramic-coffee-mug-set", quantity: 2 },
      { slug: "stainless-steel-water-bottle", quantity: 1 },
    ],
    daysAgo: 9,
    courierProvider: "Steadfast",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "rafiq@example.com",
    shippingName: "Rafiq Uddin",
    shippingPhone: "01722222244",
    shippingAddress: "Boro Bazar",
    shippingCity: "Khulna",
    paymentMethod: "Rocket",
    phoneNumber: "01722222244",
    transactionId: "TXRAF001",
    status: "approved",
    items: [{ slug: "canvas-backpack", quantity: 1 }],
    daysAgo: 14,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "backpack_ad",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "sonia@example.com",
    shippingName: "Sonia Khatun",
    shippingPhone: "01833333355",
    shippingAddress: "Sonadanga",
    shippingCity: "Khulna",
    paymentMethod: "bKash",
    phoneNumber: "01833333355",
    transactionId: "TXSON001",
    status: "pending",
    items: [
      { slug: "cotton-crewneck-tshirt", quantity: 4 },
      { slug: "classic-white-sneakers", quantity: 1 },
    ],
    daysAgo: 0,
    utmSource: "tiktok",
    utmMedium: "organic",
  },
  {
    customerEmail: "tanvir@example.com",
    shippingName: "Tanvir Hossain",
    shippingPhone: "01944444466",
    shippingAddress: "Zindabazar",
    shippingCity: "Sylhet",
    paymentMethod: "Nagad",
    phoneNumber: "01944444466",
    transactionId: "TXTAN001",
    status: "approved",
    items: [{ slug: "wireless-noise-cancelling-headphones", quantity: 1 }],
    daysAgo: 18,
    utmSource: "google",
    utmMedium: "organic",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "shila@example.com",
    shippingName: "Shila Rani",
    shippingPhone: "01655555577",
    shippingAddress: "Court Para",
    shippingCity: "Comilla",
    paymentMethod: "Cash on Delivery",
    phoneNumber: "",
    transactionId: "",
    status: "approved",
    items: [
      { slug: "minimalist-leather-wallet", quantity: 1 },
      { slug: "aromatic-scented-candle", quantity: 1 },
    ],
    daysAgo: 22,
    courierProvider: "Steadfast",
    courierStatus: "delivered",
    courierSentAt: true,
  },
  {
    customerEmail: "habib@example.com",
    shippingName: "Habib Ur Rahman",
    shippingPhone: "01766666688",
    shippingAddress: "Ambarkhana",
    shippingCity: "Sylhet",
    paymentMethod: "bKash",
    phoneNumber: "01766666688",
    transactionId: "TXHAB001",
    status: "approved",
    items: [
      { slug: "smart-fitness-watch", quantity: 1 },
      { slug: "polarized-aviator-sunglasses", quantity: 1 },
    ],
    daysAgo: 25,
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "bundle_deal",
    courierProvider: "Pathao",
    courierStatus: "delivered",
    courierSentAt: true,
    discountCode: "BUNDLE15",
    discountAmount: 1185,
  },
  {
    customerEmail: "rima@example.com",
    shippingName: "Rima Akter",
    shippingPhone: "01877777799",
    shippingAddress: "Mohakhali DOHS",
    shippingCity: "Dhaka",
    paymentMethod: "Nagad",
    phoneNumber: "01877777799",
    transactionId: "TXRIM001",
    status: "approved",
    items: [{ slug: "yoga-mat", quantity: 2 }],
    daysAgo: 2,
    utmSource: "instagram",
    utmMedium: "social",
    utmCampaign: "fitness_insta",
    courierProvider: "Steadfast",
    courierStatus: "pending",
    courierSentAt: true,
  },
  {
    customerEmail: "kamrul@example.com",
    shippingName: "Kamrul Islam",
    shippingPhone: "01988888800",
    shippingAddress: "Mogbazar",
    shippingCity: "Dhaka",
    paymentMethod: "bKash",
    phoneNumber: "01988888800",
    transactionId: "TXKAM001",
    status: "pending",
    items: [{ slug: "ceramic-coffee-mug-set", quantity: 1 }],
    daysAgo: 0,
    utmSource: "direct",
  },
  {
    customerEmail: "nazmul@example.com",
    shippingName: "Nazmul Haque",
    shippingPhone: "01611111144",
    shippingAddress: "Motijheel",
    shippingCity: "Dhaka",
    paymentMethod: "Upay",
    phoneNumber: "01611111144",
    transactionId: "TXNAZ001",
    status: "rejected",
    items: [{ slug: "mechanical-keyboard", quantity: 1 }],
    daysAgo: 6,
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "tech_deals",
  },
];

const sampleComplaints = [
  {
    fullName: "Jamil Hossain",
    phone: "01799999991",
    email: "jamil@example.com",
    message:
      "My order arrived with a damaged box and one item was scratched. Please advise on a replacement.",
    status: "open",
  },
  {
    fullName: "Sumaiya Akter",
    phone: "01799999992",
    email: "sumaiya@example.com",
    message:
      "Delivery was 3 days late. The product itself is great, but the courier never updated the tracking.",
    status: "resolved",
  },
  {
    fullName: "Imran Khan",
    phone: "01799999993",
    email: "imran@example.com",
    message:
      "I paid via bKash but the order still shows pending. Transaction ID: TX123456. Please verify.",
    status: "open",
  },
  {
    fullName: "Ayesha Siddika",
    phone: "01799999994",
    email: "ayesha@example.com",
    message:
      "I received the wrong color. Ordered black but got brown. Please arrange exchange.",
    status: "open",
  },
  {
    fullName: "Masud Rana",
    phone: "01799999995",
    email: "masud@example.com",
    message:
      "The product quality is not as shown on the website. Very disappointed.",
    status: "resolved",
  },
];

const sampleCoupons = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrder: 1000,
    maxUses: 100,
    usedCount: 12,
    active: true,
    expiresAt: new Date("2026-12-31"),
  },
  {
    code: "BUNDLE15",
    type: "percentage",
    value: 15,
    minOrder: 3000,
    maxUses: 50,
    usedCount: 5,
    active: true,
    expiresAt: new Date("2026-06-30"),
  },
  {
    code: "FLAT200",
    type: "fixed",
    value: 200,
    minOrder: 1500,
    maxUses: null,
    usedCount: 28,
    active: true,
    expiresAt: null,
  },
  {
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    minOrder: 5000,
    maxUses: 20,
    usedCount: 20,
    active: false,
    expiresAt: new Date("2026-03-31"),
  },
  {
    code: "FREE500",
    type: "fixed",
    value: 500,
    minOrder: 2000,
    maxUses: 30,
    usedCount: 8,
    active: true,
    expiresAt: new Date("2026-09-30"),
  },
];

// Generate realistic page views for analytics
function generatePageViews() {
  const pages = [
    "/",
    "/products",
    "/products/classic-white-sneakers",
    "/products/minimalist-leather-wallet",
    "/products/wireless-noise-cancelling-headphones",
    "/products/cotton-crewneck-tshirt",
    "/products/smart-fitness-watch",
    "/products/canvas-backpack",
    "/products/polarized-aviator-sunglasses",
    "/products/yoga-mat",
    "/products/ceramic-coffee-mug-set",
    "/products/stainless-steel-water-bottle",
    "/cart",
    "/checkout",
    "/complain",
  ];

  const referrers = [
    "https://www.facebook.com/",
    "https://www.google.com/",
    "https://www.tiktok.com/",
    "https://www.instagram.com/",
    "https://t.co/",
    null,
    null,
    null, // direct traffic
  ];

  const utmSources = [
    { source: "facebook", medium: "cpc", campaign: "spring_sale" },
    { source: "facebook", medium: "cpc", campaign: "backpack_ad" },
    { source: "facebook", medium: "cpc", campaign: "home_decor" },
    { source: "google", medium: "cpc", campaign: "fitness_watch" },
    { source: "google", medium: "organic", campaign: null },
    { source: "tiktok", medium: "cpc", campaign: "sneakers_tiktok" },
    { source: "instagram", medium: "social", campaign: "fitness_insta" },
    { source: "direct", medium: null, campaign: null },
    { source: null, medium: null, campaign: null },
    { source: null, medium: null, campaign: null },
  ];

  const devices = ["desktop", "mobile", "mobile", "mobile", "tablet"]; // mobile heavy
  const browsers = ["Chrome", "Safari", "Firefox", "Edge", "Samsung Internet"];
  const cities = [
    "Dhaka",
    "Dhaka",
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Comilla",
    "Gazipur",
    "Narayanganj",
  ];
  const userAgents = [
    "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) Chrome/120.0",
  ];

  const views: Array<{
    sessionId: string;
    page: string;
    referrer: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    userAgent: string;
    device: string;
    browser: string;
    city: string;
    country: string;
    ip: string;
    createdAt: Date;
  }> = [];

  // Generate ~300 sessions over the last 7 days with multiple page views each
  for (let s = 0; s < 300; s++) {
    const sessionId = `sess_${Date.now()}_${s}_${Math.random().toString(36).slice(2, 8)}`;
    const sessionDaysAgo = Math.random() * 7;
    const utm = pick(utmSources);
    const device = pick(devices);
    const browser = pick(browsers);
    const city = pick(cities);
    const ua = pick(userAgents);
    const referrer = pick(referrers);
    const ip = `103.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    // Each session has 1-8 page views
    const pageCount = 1 + Math.floor(Math.random() * 8);
    const sessionPages = [pick(pages)];
    for (let p = 1; p < pageCount; p++) {
      sessionPages.push(pick(pages));
    }

    const baseTime = daysAgo(sessionDaysAgo);
    for (let p = 0; p < sessionPages.length; p++) {
      const viewTime = new Date(baseTime.getTime() + p * (10000 + Math.random() * 120000));
      views.push({
        sessionId,
        page: sessionPages[p],
        referrer: p === 0 ? referrer : null,
        utmSource: p === 0 ? utm.source : null,
        utmMedium: p === 0 ? utm.medium : null,
        utmCampaign: p === 0 ? utm.campaign : null,
        userAgent: ua,
        device,
        browser,
        city,
        country: "BD",
        ip,
        createdAt: viewTime,
      });
    }
  }

  return views;
}

async function main() {
  console.log("🌱 Seeding database...");

  // Wipe data
  await prisma.pageView.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.landing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("✓ Cleared all data");

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

  // Orders
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

    let amount = itemsData.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountAmount = (order as { discountAmount?: number }).discountAmount ?? 0;
    amount = Math.max(0, amount - discountAmount);

    const customer = await prisma.customer.upsert({
      where: { phone: order.shippingPhone },
      create: {
        fullName: order.shippingName,
        phone: order.shippingPhone,
        email: order.customerEmail,
        address: order.shippingAddress,
        city: order.shippingCity,
      },
      update: {
        fullName: order.shippingName,
        email: order.customerEmail ?? undefined,
        address: order.shippingAddress,
        city: order.shippingCity,
      },
    });

    const createdAt = daysAgo(order.daysAgo);
    const courierSentAt =
      (order as { courierSentAt?: boolean }).courierSentAt
        ? new Date(createdAt.getTime() + 24 * 60 * 60 * 1000)
        : undefined;

    await prisma.purchase.create({
      data: {
        customerId: customer.id,
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
        utmSource: (order as { utmSource?: string }).utmSource ?? null,
        utmMedium: (order as { utmMedium?: string }).utmMedium ?? null,
        utmCampaign: (order as { utmCampaign?: string }).utmCampaign ?? null,
        discountCode: (order as { discountCode?: string }).discountCode ?? null,
        discountAmount,
        courierProvider: (order as { courierProvider?: string }).courierProvider ?? null,
        courierStatus: (order as { courierStatus?: string }).courierStatus ?? null,
        courierSentAt: courierSentAt ?? null,
        createdAt,
        items: { create: itemsData },
      },
    });
  }
  const customerCount = await prisma.customer.count();
  console.log(
    `✓ Seeded ${sampleOrders.length} orders + ${customerCount} customers`
  );

  // Complaints
  for (const c of sampleComplaints) {
    await prisma.complaint.create({ data: c });
  }
  console.log(`✓ Seeded ${sampleComplaints.length} complaints`);

  // Coupons
  for (const c of sampleCoupons) {
    await prisma.coupon.create({ data: c });
  }
  console.log(`✓ Seeded ${sampleCoupons.length} coupons`);

  // Page Views
  const pageViews = generatePageViews();
  await prisma.pageView.createMany({ data: pageViews });
  console.log(`✓ Seeded ${pageViews.length} page views across ~300 sessions`);

  // Site Settings (marketing, social, banner defaults)
  const settings = [
    { key: "facebook", value: "https://facebook.com/alamirat" },
    { key: "instagram", value: "https://instagram.com/alamirat" },
    { key: "whatsapp", value: "8801712345678" },
    { key: "banner_enabled", value: "true" },
    { key: "banner_text", value: "Free shipping on orders over ৳2,000!" },
    { key: "banner_link", value: "/products" },
    { key: "banner_bg_color", value: "#1a1a2e" },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✓ Seeded site settings`);

  console.log("✅ Done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
