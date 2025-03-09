"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const server_1 = require("../server");
const User_1 = require("../models/User");
const FoodEntry_1 = require("../models/FoodEntry");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let mongoServer;
let token;
let userId;
let testFoodEntryId;
beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose_1.default.connect(mongoUri);
    // Create test user for our tests
    const testUser = new User_1.User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123' // This will be hashed in the model pre-save hook
    });
    await testUser.save();
    userId = testUser._id.toString();
    // Create token for auth
    token = jsonwebtoken_1.default.sign({ userId: testUser._id, email: testUser.email }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
beforeEach(async () => {
    // Clear food entries collection before each test
    await FoodEntry_1.FoodEntry.deleteMany({});
});
describe('Auth API', () => {
    test('should register a new user', async () => {
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/api/auth/register')
            .send({
            name: 'New User',
            email: 'newuser@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toEqual('newuser@example.com');
    });
    test('should login existing user', async () => {
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toEqual('test@example.com');
    });
    test('should reject login with incorrect password', async () => {
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    });
});
describe('Food Entries API', () => {
    test('should create a new food entry', async () => {
        const newEntry = {
            name: 'Test Food',
            calories: 300,
            mealType: 'lunch',
            timestamp: new Date().toISOString()
        };
        const res = await (0, supertest_1.default)(server_1.app)
            .post('/api/entries')
            .set('Authorization', `Bearer ${token}`)
            .send(newEntry);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toEqual(newEntry.name);
        expect(res.body.calories).toEqual(newEntry.calories);
        expect(res.body.userId.toString()).toEqual(userId);
        testFoodEntryId = res.body._id;
    });
    test('should get all food entries for user', async () => {
        // Create a few test entries first
        const testEntries = [
            { name: 'Food 1', calories: 200, mealType: 'breakfast', userId },
            { name: 'Food 2', calories: 300, mealType: 'lunch', userId },
            { name: 'Food 3', calories: 400, mealType: 'dinner', userId }
        ];
        await FoodEntry_1.FoodEntry.insertMany(testEntries);
        const res = await (0, supertest_1.default)(server_1.app)
            .get('/api/entries')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toEqual(3);
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('calories');
    });
    test('should get entries for a specific date', async () => {
        // Clear existing entries
        await FoodEntry_1.FoodEntry.deleteMany({});
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        // Create entries for today and yesterday
        const testEntries = [
            {
                name: 'Today Food 1',
                calories: 200,
                mealType: 'breakfast',
                userId,
                timestamp: today
            },
            {
                name: 'Today Food 2',
                calories: 300,
                mealType: 'lunch',
                userId,
                timestamp: today
            },
            {
                name: 'Yesterday Food',
                calories: 400,
                mealType: 'dinner',
                userId,
                timestamp: yesterday
            }
        ];
        await FoodEntry_1.FoodEntry.insertMany(testEntries);
        const dateParam = today.toISOString().split('T')[0]; // Just the date part
        const res = await (0, supertest_1.default)(server_1.app)
            .get(`/api/entries/date/${dateParam}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toEqual(2); // Only today's entries
        expect(res.body[0].name).toContain('Today');
    });
    test('should update a food entry', async () => {
        // Create an entry to update
        const entry = new FoodEntry_1.FoodEntry({
            name: 'Food to update',
            calories: 250,
            mealType: 'snack',
            userId
        });
        await entry.save();
        const entryId = entry._id.toString();
        const updatedData = {
            name: 'Updated Food',
            calories: 300,
            mealType: 'lunch'
        };
        const res = await (0, supertest_1.default)(server_1.app)
            .put(`/api/entries/${entryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(entryId);
        expect(res.body.name).toEqual(updatedData.name);
        expect(res.body.calories).toEqual(updatedData.calories);
    });
    test('should delete a food entry', async () => {
        // Create an entry to delete
        const entry = new FoodEntry_1.FoodEntry({
            name: 'Food to delete',
            calories: 150,
            mealType: 'snack',
            userId
        });
        await entry.save();
        const entryId = entry._id.toString();
        const res = await (0, supertest_1.default)(server_1.app)
            .delete(`/api/entries/${entryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('deleted');
        // Verify it's gone
        const deleted = await FoodEntry_1.FoodEntry.findById(entryId);
        expect(deleted).toBeNull();
    });
    test('should reject requests without authentication', async () => {
        const res = await (0, supertest_1.default)(server_1.app)
            .get('/api/entries');
        expect(res.statusCode).toEqual(401);
    });
});
