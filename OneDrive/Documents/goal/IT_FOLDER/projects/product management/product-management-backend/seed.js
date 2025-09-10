const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const sampleProducts = [
  { 
    name: "Classic Watch", 
    price: 990.99, 
    category: "Accessories", 
    description: "Elegant analog watch.", 
    image: "/images/watch.jpg"
  },
  { 
    name: "Running Shoes", 
    price: 590, 
    category: "Footwear", 
    description: "Comfortable running shoes.", 
    image: "/images/shoes.jpg"
  },
  { 
    name: "Bluetooth Headset", 
    price: 290., 
    category: "Electronics", 
    description: "Lightweight wireless headset.", 
    image: "/images/headset.jpg"
  },
  { 
    name: "Denim Jacket", 
    price: 790.99, 
    category: "Clothing", 
    description: "Stylish blue denim jacket for all seasons.", 
    image: "/images/jacket.jpg"
  },
  { 
    name: "Microwave Oven", 
    price: 10599, 
    category: "Home Appliances", 
    description: "Compact microwave oven with smart settings.", 
    image: "/images/oven.jpg"
  },
  { 
    name: "web technologies book", 
    price: 140.99, 
    category: "Books", 
    description: "Classic novel by F. Scott Fitzgerald.", 
    image: "/images/book.jpg"
  },
  { 
    name: "Face Cream", 
    price: 190.99, 
    category: "Beauty", 
    description: "Hydrating face cream for glowing skin.", 
    image: "/images/face cream.jpg"
  },
  { 
    name: "Football", 
    price: 240.9, 
    category: "Sports", 
    description: "Durable football suitable for outdoor play.", 
    image: "/images/football.jpg"
  },
  // Example product with no image provided → will fallback
  { 
    name: "Mystery Product", 
    price: 49.99, 
    category: "Misc", 
    description: "This product didn’t have an image.", 
    image: "" // left empty, handled below
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to MongoDB");

    // Clear old products
    await Product.deleteMany();

    // Insert with fallback image
    const withFallback = sampleProducts.map(p => ({
      ...p,
      image: p.image && p.image.trim() !== "" ? p.image : "/images/no-image.png"
    }));

    await Product.insertMany(withFallback);

    console.log("✅ Products seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
}

seed();
