import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloomtale';

async function checkCombo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    
    console.log('\n=== ALL PRODUCTS WITH COMBO STATUS ===\n');
    
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   combo: ${p.combo} (type: ${typeof p.combo})`);
      console.log(`   is_active: ${p.is_active}`);
      console.log('---');
    });

    console.log(`\nTotal products: ${products.length}`);
    console.log(`Products with combo=true: ${products.filter(p => p.combo === true).length}`);
    console.log(`Products with category=Combos: ${products.filter(p => p.category === 'Combos').length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCombo();
