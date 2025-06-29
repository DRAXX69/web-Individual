const mongoose = require('mongoose');
const User = require('../models/User');
const Hypercar = require('../models/Hypercar');
require('dotenv').config();

const sampleHypercars = [
  {
    brand: "Bugatti",
    name: "Chiron Super Sport 300+",
    model: "Chiron",
    year: 2021,
    price: {
      amount: 3900000,
      currency: "USD",
      formatted: "$3.9M"
    },
    emoji: "🏎️",
    images: [
      {
        url: "/uploads/bugatti-chiron.jpg",
        alt: "Bugatti Chiron Super Sport 300+",
        isPrimary: true,
        order: 0
      }
    ],
    specs: {
      power: {
        value: 1578,
        unit: "HP",
        formatted: "1,578 HP"
      },
      topSpeed: {
        value: 304,
        unit: "MPH",
        formatted: "304 MPH"
      },
      acceleration: {
        value: 2.4,
        unit: "s",
        formatted: "2.4s 0-60"
      },
      engine: {
        displacement: 8.0,
        cylinders: 16,
        configuration: "W16",
        description: "8.0L W16 Quad-Turbo"
      },
      weight: {
        value: 1995,
        unit: "kg"
      },
      transmission: "Automatic",
      drivetrain: "AWD"
    },
    description: {
      short: "The fastest production car in the world, capable of reaching 304 mph",
      long: "The Bugatti Chiron Super Sport 300+ represents the pinnacle of automotive engineering. With its massive 8.0L W16 engine producing 1,578 horsepower, this hypercar can accelerate from 0-60 mph in just 2.4 seconds and reach a top speed of 304 mph, making it the fastest production car ever built."
    },
    features: [
      {
        name: "Carbon Fiber Monocoque",
        description: "Ultra-lightweight and rigid chassis",
        category: "Performance"
      },
      {
        name: "Active Aerodynamics",
        description: "Adaptive rear wing and underbody",
        category: "Performance"
      },
      {
        name: "Carbon Ceramic Brakes",
        description: "Exceptional stopping power",
        category: "Safety"
      }
    ],
    production: {
      limited: true,
      units: 30,
      startYear: 2021,
      endYear: 2022
    },
    status: "available",
    location: {
      country: "France",
      city: "Molsheim",
      dealership: "Bugatti Factory"
    },
    tags: ["fastest", "luxury", "exclusive", "record-breaker"],
    isFeatured: true,
    isActive: true
  },
  {
    brand: "Koenigsegg",
    name: "Jesko Absolut",
    model: "Jesko",
    year: 2022,
    price: {
      amount: 3400000,
      currency: "USD",
      formatted: "$3.4M"
    },
    emoji: "⚡",
    images: [
      {
        url: "/uploads/koenigsegg-jesko.jpg",
        alt: "Koenigsegg Jesko Absolut",
        isPrimary: true,
        order: 0
      }
    ],
    specs: {
      power: {
        value: 1600,
        unit: "HP",
        formatted: "1,600 HP"
      },
      topSpeed: {
        value: 330,
        unit: "MPH",
        formatted: "330 MPH"
      },
      acceleration: {
        value: 2.5,
        unit: "s",
        formatted: "2.5s 0-60"
      },
      engine: {
        displacement: 5.0,
        cylinders: 8,
        configuration: "V8",
        description: "5.0L V8 Twin-Turbo"
      },
      weight: {
        value: 1320,
        unit: "kg"
      },
      transmission: "Semi-Automatic",
      drivetrain: "RWD"
    },
    description: {
      short: "The most powerful Koenigsegg ever built, designed for ultimate speed",
      long: "The Koenigsegg Jesko Absolut is the most powerful and fastest Koenigsegg ever created. With 1,600 horsepower from its twin-turbo V8 engine, this hypercar is designed to break speed records and push the boundaries of what's possible in automotive engineering."
    },
    features: [
      {
        name: "Light Speed Transmission",
        description: "Revolutionary 9-speed transmission",
        category: "Technology"
      },
      {
        name: "Triplex Suspension",
        description: "Advanced suspension system",
        category: "Performance"
      },
      {
        name: "Carbon Fiber Wheels",
        description: "Ultra-lightweight forged wheels",
        category: "Performance"
      }
    ],
    production: {
      limited: true,
      units: 125,
      startYear: 2022,
      endYear: 2025
    },
    status: "available",
    location: {
      country: "Sweden",
      city: "Ängelholm",
      dealership: "Koenigsegg Factory"
    },
    tags: ["powerful", "swedish", "innovative", "speed"],
    isFeatured: true,
    isActive: true
  },
  {
    brand: "McLaren",
    name: "Speedtail",
    model: "Speedtail",
    year: 2020,
    price: {
      amount: 2200000,
      currency: "USD",
      formatted: "$2.2M"
    },
    emoji: "🚀",
    images: [
      {
        url: "/uploads/mclaren-speedtail.jpg",
        alt: "McLaren Speedtail",
        isPrimary: true,
        order: 0
      }
    ],
    specs: {
      power: {
        value: 1035,
        unit: "HP",
        formatted: "1,035 HP"
      },
      topSpeed: {
        value: 250,
        unit: "MPH",
        formatted: "250 MPH"
      },
      acceleration: {
        value: 2.5,
        unit: "s",
        formatted: "2.5s 0-60"
      },
      engine: {
        displacement: 4.0,
        cylinders: 8,
        configuration: "V8",
        description: "Hybrid V8 Twin-Turbo"
      },
      weight: {
        value: 1430,
        unit: "kg"
      },
      transmission: "Automatic",
      drivetrain: "RWD"
    },
    description: {
      short: "The most aerodynamic McLaren ever built, inspired by the legendary F1",
      long: "The McLaren Speedtail is the spiritual successor to the legendary F1, featuring a central driving position and revolutionary aerodynamics. This hybrid hypercar combines electric power with a twin-turbo V8 to deliver exceptional performance while maintaining the purity of the driving experience."
    },
    features: [
      {
        name: "Central Driving Position",
        description: "Inspired by the legendary F1",
        category: "Design"
      },
      {
        name: "Active Aerodynamics",
        description: "Revolutionary drag reduction system",
        category: "Performance"
      },
      {
        name: "Hybrid Powertrain",
        description: "Combines electric and combustion power",
        category: "Technology"
      }
    ],
    production: {
      limited: true,
      units: 106,
      startYear: 2020,
      endYear: 2021
    },
    status: "available",
    location: {
      country: "United Kingdom",
      city: "Woking",
      dealership: "McLaren Factory"
    },
    tags: ["hybrid", "aerodynamic", "f1-inspired", "british"],
    isFeatured: true,
    isActive: true
  },
  {
    brand: "Pagani",
    name: "Huayra BC Roadster",
    model: "Huayra",
    year: 2021,
    price: {
      amount: 3500000,
      currency: "USD",
      formatted: "$3.5M"
    },
    emoji: "💨",
    images: [
      {
        url: "/uploads/pagani-huayra.jpg",
        alt: "Pagani Huayra BC Roadster",
        isPrimary: true,
        order: 0
      }
    ],
    specs: {
      power: {
        value: 791,
        unit: "HP",
        formatted: "791 HP"
      },
      topSpeed: {
        value: 238,
        unit: "MPH",
        formatted: "238 MPH"
      },
      acceleration: {
        value: 2.8,
        unit: "s",
        formatted: "2.8s 0-60"
      },
      engine: {
        displacement: 6.0,
        cylinders: 12,
        configuration: "V12",
        description: "6.0L V12 Twin-Turbo"
      },
      weight: {
        value: 1218,
        unit: "kg"
      },
      transmission: "Semi-Automatic",
      drivetrain: "RWD"
    },
    description: {
      short: "A masterpiece of art and engineering, the ultimate open-top hypercar",
      long: "The Pagani Huayra BC Roadster is a work of art that happens to be a hypercar. Every detail is crafted with obsessive attention, from the hand-stitched leather to the titanium exhaust system. This roadster version offers the ultimate driving experience with the wind in your hair."
    },
    features: [
      {
        name: "Carbon Fiber Body",
        description: "Hand-crafted carbon fiber panels",
        category: "Design"
      },
      {
        name: "Titanium Exhaust",
        description: "Lightweight and sonorous exhaust system",
        category: "Performance"
      },
      {
        name: "Hand-Stitched Interior",
        description: "Bespoke leather and carbon fiber interior",
        category: "Comfort"
      }
    ],
    production: {
      limited: true,
      units: 40,
      startYear: 2021,
      endYear: 2022
    },
    status: "available",
    location: {
      country: "Italy",
      city: "San Cesario sul Panaro",
      dealership: "Pagani Factory"
    },
    tags: ["art", "italian", "roadster", "bespoke"],
    isFeatured: true,
    isActive: true
  },
  {
    brand: "Ferrari",
    name: "LaFerrari Aperta",
    model: "LaFerrari",
    year: 2017,
    price: {
      amount: 2200000,
      currency: "USD",
      formatted: "$2.2M"
    },
    emoji: "🔥",
    images: [
      {
        url: "/uploads/ferrari-laferrari.jpg",
        alt: "Ferrari LaFerrari Aperta",
        isPrimary: true,
        order: 0
      }
    ],
    specs: {
      power: {
        value: 949,
        unit: "HP",
        formatted: "949 HP"
      },
      topSpeed: {
        value: 217,
        unit: "MPH",
        formatted: "217 MPH"
      },
      acceleration: {
        value: 2.4,
        unit: "s",
        formatted: "2.4s 0-60"
      },
      engine: {
        displacement: 6.3,
        cylinders: 12,
        configuration: "V12",
        description: "Hybrid V12"
      },
      weight: {
        value: 1255,
        unit: "kg"
      },
      transmission: "Semi-Automatic",
      drivetrain: "RWD"
    },
    description: {
      short: "The ultimate expression of Ferrari's hybrid technology and open-top driving",
      long: "The Ferrari LaFerrari Aperta represents the pinnacle of Ferrari's hybrid technology. This open-top version of the legendary LaFerrari combines the thrill of open-air driving with the incredible performance of Ferrari's most advanced powertrain ever created."
    },
    features: [
      {
        name: "HY-KERS System",
        description: "Ferrari's hybrid kinetic energy recovery",
        category: "Technology"
      },
      {
        name: "Carbon Fiber Monocoque",
        description: "Ultra-rigid and lightweight chassis",
        category: "Performance"
      },
      {
        name: "Active Aerodynamics",
        description: "Dynamic downforce generation",
        category: "Performance"
      }
    ],
    production: {
      limited: true,
      units: 210,
      startYear: 2017,
      endYear: 2018
    },
    status: "available",
    location: {
      country: "Italy",
      city: "Maranello",
      dealership: "Ferrari Factory"
    },
    tags: ["ferrari", "hybrid", "aperta", "italian"],
    isFeatured: true,
    isActive: true
  },
  {
    brand: "Lamborghini",
    name: "Sián FKP 37",
    model: "Sián",
    year: 2020,
    price: {
      amount: 3600000,
      currency: "USD",
      formatted: "$3.6M"
    },
    emoji: "⚡",
    images: [
      {
        url: "/uploads/lamborghini-sian.jpg",
        alt: "Lamborghini Sián FKP 37",
        isPrimary: true,
        order: 0
      }
    ],
    specs: {
      power: {
        value: 819,
        unit: "HP",
        formatted: "819 HP"
      },
      topSpeed: {
        value: 217,
        unit: "MPH",
        formatted: "217 MPH"
      },
      acceleration: {
        value: 2.8,
        unit: "s",
        formatted: "2.8s 0-60"
      },
      engine: {
        displacement: 6.5,
        cylinders: 12,
        configuration: "V12",
        description: "Hybrid V12"
      },
      weight: {
        value: 1595,
        unit: "kg"
      },
      transmission: "Automatic",
      drivetrain: "AWD"
    },
    description: {
      short: "Lamborghini's first hybrid hypercar, combining electric power with V12 fury",
      long: "The Lamborghini Sián FKP 37 is the first hybrid hypercar from the Italian marque. Named in honor of Ferdinand Karl Piëch, this revolutionary vehicle combines the raw power of a naturally aspirated V12 with electric assistance for unprecedented performance and efficiency."
    },
    features: [
      {
        name: "Supercapacitor Technology",
        description: "Revolutionary energy storage system",
        category: "Technology"
      },
      {
        name: "Active Aerodynamics",
        description: "Adaptive wing and underbody",
        category: "Performance"
      },
      {
        name: "Carbon Fiber Body",
        description: "Ultra-lightweight construction",
        category: "Performance"
      }
    ],
    production: {
      limited: true,
      units: 63,
      startYear: 2020,
      endYear: 2021
    },
    status: "available",
    location: {
      country: "Italy",
      city: "Sant'Agata Bolognese",
      dealership: "Lamborghini Factory"
    },
    tags: ["lamborghini", "hybrid", "italian", "supercapacitor"],
    isFeatured: true,
    isActive: true
  }
];

const sampleUsers = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@vipmotors.com",
    phone: "+1234567890",
    password: "vip123",
    role: "admin",
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1987654321",
    password: "password123",
    role: "user",
    isEmailVerified: true,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vip-motors');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Hypercar.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const createdUsers = await User.create(sampleUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create sample hypercars
    const createdHypercars = await Hypercar.create(sampleHypercars);
    console.log(`🏎️  Created ${createdHypercars.length} hypercars`);

    // Add some favorites to users
    const user = createdUsers.find(u => u.role === 'user');
    if (user && createdHypercars.length > 0) {
      user.favorites = createdHypercars.slice(0, 3).map(car => car._id);
      await user.save();
      console.log('❤️  Added favorites to user');
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Sample Data:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Hypercars: ${createdHypercars.length}`);
    console.log('\n🔑 Admin Login:');
    console.log('Email: admin@vipmotors.com');
    console.log('Password: vip123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seed function
seedDatabase(); 