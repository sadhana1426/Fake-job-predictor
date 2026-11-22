const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Prediction = require('./models/Prediction');

dotenv.config({ path: './.env' }); // Adjust path if needed or run from server dir

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fakejobpredictor');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear DB
        await User.deleteMany();
        await Prediction.deleteMany();
        console.log('Data Destroyed...');

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        const user1 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('Users Created...');

        // Create Predictions
        await Prediction.create({
            user: user1._id,
            inputData: { skills: ['React', 'Node'], experience: 3, education: 'B.Sc' },
            result: {
                jobTitle: 'Frontend Wizard',
                score: 85,
                explanation: 'You are a wizard, Harry.',
                suggestions: ['Learn magic', 'Buy a wand']
            }
        });

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
