const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Prediction = require('../src/models/Prediction');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/fakejobpredictor_test');

    // Register a user to get token
    const res = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Predict User',
            email: 'predict@example.com',
            password: 'password123'
        });
    token = res.body.token;
});

afterAll(async () => {
    await Prediction.deleteMany();
    await User.deleteMany();
    await mongoose.connection.close();
});

describe('Prediction Endpoints', () => {
    it('should create a prediction', async () => {
        const res = await request(app)
            .post('/api/predict')
            .set('Authorization', `Bearer ${token}`)
            .send({
                skills: ['React', 'Node.js'],
                experience: 5
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.result.jobTitle).toContain('Developer');
    });

    it('should get user predictions', async () => {
        const res = await request(app)
            .get('/api/predict/user')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });
});
