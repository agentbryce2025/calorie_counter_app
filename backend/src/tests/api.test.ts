import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../server';
import { User } from '../models/User';
import { FoodEntry } from '../models/FoodEntry';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;
let token: string;
let userId: string;
let testFoodEntryId: string;

beforeAll(async () => {
  // Set up MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create test user for our tests
  const testUser = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123' // This will be hashed in the model pre-save hook
  });
  
  await testUser.save();
  userId = testUser._id.toString();
  
  // Create token for auth
  token = jwt.sign(
    { userId: testUser._id, email: testUser.email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear food entries collection before each test
  await FoodEntry.deleteMany({});
});

describe('Auth API', () => {
  test('should register a new user', async () => {
    const res = await request(app)
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
    const res = await request(app)
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
    const res = await request(app)
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
    
    const res = await request(app)
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
    
    await FoodEntry.insertMany(testEntries);
    
    const res = await request(app)
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
    await FoodEntry.deleteMany({});
    
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
    
    await FoodEntry.insertMany(testEntries);
    
    const dateParam = today.toISOString().split('T')[0]; // Just the date part
    
    const res = await request(app)
      .get(`/api/entries/date/${dateParam}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2); // Only today's entries
    expect(res.body[0].name).toContain('Today');
  });

  test('should update a food entry', async () => {
    // Create an entry to update
    const entry = new FoodEntry({
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
    
    const res = await request(app)
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
    const entry = new FoodEntry({
      name: 'Food to delete',
      calories: 150,
      mealType: 'snack',
      userId
    });
    
    await entry.save();
    const entryId = entry._id.toString();
    
    const res = await request(app)
      .delete(`/api/entries/${entryId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('deleted');
    
    // Verify it's gone
    const deleted = await FoodEntry.findById(entryId);
    expect(deleted).toBeNull();
  });

  test('should reject requests without authentication', async () => {
    const res = await request(app)
      .get('/api/entries');
    
    expect(res.statusCode).toEqual(401);
  });
});