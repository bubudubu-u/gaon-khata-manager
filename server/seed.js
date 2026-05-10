const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Person = require('./models/Person');
const KhataEntry = require('./models/Khata');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Person.deleteMany({});
    await KhataEntry.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'प्रधान जी',
      email: 'admin@gaonkhata.com',
      password: 'admin123',
      role: 'admin',
      village: 'रामपुर',
      phone: '9876543210'
    });

    // Create sample persons
    const persons = await Person.insertMany([
      {
        user: admin._id,
        name: 'राम सिंह',
        fatherName: 'श्याम सिंह',
        village: 'रामपुर',
        mobile: '9876543211',
        notes: 'अच्छे किसान हैं',
        totalLand: 5
      },
      {
        user: admin._id,
        name: 'मोहन लाल',
        fatherName: 'गोपाल लाल',
        village: 'रामपुर',
        mobile: '9876543212',
        totalLand: 8
      },
      {
        user: admin._id,
        name: 'सीता देवी',
        fatherName: 'राम प्रसाद',
        village: 'श्यामपुर',
        mobile: '9876543213',
        totalLand: 3
      },
      {
        user: admin._id,
        name: 'गीता बाई',
        fatherName: 'लक्ष्मण जी',
        village: 'रामपुर',
        mobile: '9876543214',
        totalLand: 10
      },
      {
        user: admin._id,
        name: 'राजू यादव',
        fatherName: 'सुरेश यादव',
        village: 'फूलपुर',
        mobile: '9876543215',
        totalLand: 6
      }
    ]);

    // Create sample khata entries
    const khataEntries = await KhataEntry.insertMany([
      {
        user: admin._id,
        person: persons[0]._id,
        entryType: 'charha',
        date: new Date('2024-01-15'),
        year: 2024,
        landDetails: {
          size: 2,
          unit: 'bigha',
          khasraNumber: 'KH-123',
          landType: 'sinchit'
        },
        financials: {
          rate: 50000,
          rateUnit: 'per_bigha',
          totalAmount: 100000,
          paidAmount: 75000,
          paymentMode: 'cash'
        },
        description: 'गेहूं की फसल के लिए चरहा'
      },
      {
        user: admin._id,
        person: persons[0]._id,
        entryType: 'batai',
        date: new Date('2024-03-20'),
        year: 2024,
        landDetails: {
          size: 3,
          unit: 'bigha',
          landType: 'sinchit'
        },
        financials: {
          totalAmount: 150000,
          paidAmount: 150000,
          paymentMode: 'bank_transfer'
        },
        description: 'धान की फसल की बटाई'
      },
      {
        user: admin._id,
        person: persons[1]._id,
        entryType: 'patta',
        date: new Date('2024-02-01'),
        year: 2024,
        landDetails: {
          size: 4,
          unit: 'bigha',
          khasraNumber: 'KH-456',
          landType: 'sinchit'
        },
        financials: {
          rate: 60000,
          rateUnit: 'per_bigha',
          totalAmount: 240000,
          paidAmount: 100000,
          paymentMode: 'cash'
        },
        description: 'गन्ने की फसल का पट्टा'
      },
      {
        user: admin._id,
        person: persons[2]._id,
        entryType: 'bakaya',
        date: new Date('2023-06-15'),
        year: 2023,
        landDetails: {
          size: 1.5,
          unit: 'bigha',
          landType: 'asinchit'
        },
        financials: {
          totalAmount: 75000,
          paidAmount: 0,
          paymentMode: 'cash'
        },
        description: 'पिछले साल का बकाया'
      },
      {
        user: admin._id,
        person: persons[3]._id,
        entryType: 'charha',
        date: new Date('2024-04-10'),
        year: 2024,
        landDetails: {
          size: 5,
          unit: 'bigha',
          khasraNumber: 'KH-789',
          landType: 'sinchit'
        },
        financials: {
          rate: 45000,
          rateUnit: 'per_bigha',
          totalAmount: 225000,
          paidAmount: 200000,
          paymentMode: 'upi'
        },
        description: 'मक्का की फसल'
      }
    ]);

    console.log('Seed data inserted successfully!');
    console.log(`Created ${await User.countDocuments()} users`);
    console.log(`Created ${await Person.countDocuments()} persons`);
    console.log(`Created ${await KhataEntry.countDocuments()} khata entries`);
    console.log('\nAdmin Login:');
    console.log('Email: admin@gaonkhata.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
