const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://kritan879:ZBVIqLEwsadSOC6O@cluster0.jetnheo.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectMongoDB }; 