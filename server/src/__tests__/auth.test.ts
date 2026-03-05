import request from 'supertest';
import app from '../server';
import fs from 'fs';
import path from 'path';

describe('Auth routes', () => {
  beforeEach(() => {
    // Clean test users file before each test
    const testFile = path.join(process.cwd(), 'server', 'data', 'users.test.json');
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  it('should register and login a user', async () => {
    const resRegister = await request(app)
      .post('/api/auth/register')
      .send({ email: 'testuser@example.com', password: 'password123', name: 'Test User' });
    expect(resRegister.status).toBe(201);
    
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });
    expect(resLogin.status).toBe(200);
    expect(resLogin.body).toHaveProperty('token');
  });
});
