const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/food-health-app').then(async () => {
  const db = mongoose.connection.db;
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Upsert user
  await db.collection('users').updateOne(
    { email: 'test@example.com' },
    { $set: { password: hashedPassword, profile: { age: 25, gender: 'male', height: 175, weight: 70, activityLevel: 'active', goal: 'gain_muscle' } } },
    { upsert: true }
  );
  
  console.log('Password updated for test@example.com to password123');
  process.exit(0);
}).catch(console.error);
