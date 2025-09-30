const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create default admin user if it doesn't exist
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const User = require('../models/User');
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('✅ Default admin user created: admin@example.com / admin123');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

module.exports = connectDB;
