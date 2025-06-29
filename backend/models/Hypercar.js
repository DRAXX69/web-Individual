const mongoose = require('mongoose');

const hypercarSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  name: {
    type: String,
    required: [true, 'Car name is required'],
    trim: true,
    maxlength: [100, 'Car name cannot exceed 100 characters']
  },
  model: {
    type: String,
    trim: true,
    maxlength: [50, 'Model name cannot exceed 50 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future']
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price amount is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CHF']
    },
    formatted: {
      type: String,
      required: [true, 'Formatted price is required']
    }
  },
  emoji: {
    type: String,
    default: '🏎️'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  specs: {
    power: {
      value: {
        type: Number,
        required: [true, 'Power value is required'],
        min: [0, 'Power cannot be negative']
      },
      unit: {
        type: String,
        default: 'HP',
        enum: ['HP', 'kW', 'PS']
      },
      formatted: {
        type: String,
        required: [true, 'Formatted power is required']
      }
    },
    topSpeed: {
      value: {
        type: Number,
        required: [true, 'Top speed value is required'],
        min: [0, 'Top speed cannot be negative']
      },
      unit: {
        type: String,
        default: 'MPH',
        enum: ['MPH', 'KMH']
      },
      formatted: {
        type: String,
        required: [true, 'Formatted top speed is required']
      }
    },
    acceleration: {
      value: {
        type: Number,
        required: [true, 'Acceleration value is required'],
        min: [0, 'Acceleration cannot be negative']
      },
      unit: {
        type: String,
        default: 's',
        enum: ['s']
      },
      formatted: {
        type: String,
        required: [true, 'Formatted acceleration is required']
      }
    },
    engine: {
      displacement: {
        type: Number,
        min: [0, 'Engine displacement cannot be negative']
      },
      cylinders: {
        type: Number,
        min: [1, 'Engine must have at least 1 cylinder']
      },
      configuration: {
        type: String,
        enum: ['I4', 'I6', 'V6', 'V8', 'V10', 'V12', 'W12', 'W16', 'Hybrid', 'Electric']
      },
      description: {
        type: String,
        required: [true, 'Engine description is required'],
        maxlength: [100, 'Engine description cannot exceed 100 characters']
      }
    },
    weight: {
      value: {
        type: Number,
        min: [0, 'Weight cannot be negative']
      },
      unit: {
        type: String,
        default: 'kg',
        enum: ['kg', 'lbs']
      }
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'Semi-Automatic', 'CVT']
    },
    drivetrain: {
      type: String,
      enum: ['RWD', 'FWD', 'AWD', '4WD']
    }
  },
  description: {
    short: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    long: {
      type: String,
      maxlength: [2000, 'Long description cannot exceed 2000 characters']
    }
  },
  features: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['Performance', 'Comfort', 'Technology', 'Safety', 'Design']
    }
  }],
  production: {
    limited: {
      type: Boolean,
      default: false
    },
    units: {
      type: Number,
      min: [0, 'Production units cannot be negative']
    },
    startYear: Number,
    endYear: Number
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'coming-soon', 'discontinued'],
    default: 'available'
  },
  location: {
    country: String,
    city: String,
    dealership: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full car name
hypercarSchema.virtual('fullName').get(function() {
  return `${this.brand} ${this.name}`;
});

// Virtual for price in different currencies
hypercarSchema.virtual('priceUSD').get(function() {
  if (this.price.currency === 'USD') return this.price.amount;
  // Add conversion logic here if needed
  return this.price.amount;
});

// Indexes for better query performance
hypercarSchema.index({ brand: 1, name: 1 });
hypercarSchema.index({ status: 1 });
hypercarSchema.index({ isFeatured: 1 });
hypercarSchema.index({ isActive: 1 });
hypercarSchema.index({ tags: 1 });
hypercarSchema.index({ 'specs.power.value': -1 });
hypercarSchema.index({ 'specs.topSpeed.value': -1 });
hypercarSchema.index({ 'price.amount': -1 });

// Pre-save middleware to update formatted fields
hypercarSchema.pre('save', function(next) {
  // Update formatted price if not provided
  if (!this.price.formatted) {
    this.price.formatted = `${this.price.currency} ${this.price.amount.toLocaleString()}`;
  }
  
  // Update formatted power if not provided
  if (!this.specs.power.formatted) {
    this.specs.power.formatted = `${this.specs.power.value} ${this.specs.power.unit}`;
  }
  
  // Update formatted top speed if not provided
  if (!this.specs.topSpeed.formatted) {
    this.specs.topSpeed.formatted = `${this.specs.topSpeed.value} ${this.specs.topSpeed.unit}`;
  }
  
  // Update formatted acceleration if not provided
  if (!this.specs.acceleration.formatted) {
    this.specs.acceleration.formatted = `${this.specs.acceleration.value}s 0-60`;
  }
  
  next();
});

// Static method to find featured hypercars
hypercarSchema.statics.findFeatured = function() {
  return this.find({ 
    isFeatured: true, 
    isActive: true 
  }).sort({ createdAt: -1 });
};

// Static method to find hypercars by brand
hypercarSchema.statics.findByBrand = function(brand) {
  return this.find({ 
    brand: new RegExp(brand, 'i'), 
    isActive: true 
  }).sort({ 'specs.power.value': -1 });
};

// Static method to find hypercars by price range
hypercarSchema.statics.findByPriceRange = function(min, max) {
  return this.find({
    'price.amount': { $gte: min, $lte: max },
    isActive: true
  }).sort({ 'price.amount': -1 });
};

// Method to increment views
hypercarSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment favorites
hypercarSchema.methods.incrementFavorites = function() {
  this.favorites += 1;
  return this.save();
};

// Method to decrement favorites
hypercarSchema.methods.decrementFavorites = function() {
  if (this.favorites > 0) {
    this.favorites -= 1;
  }
  return this.save();
};

module.exports = mongoose.model('Hypercar', hypercarSchema); 