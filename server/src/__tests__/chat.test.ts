import request from 'supertest';
import app from '../server';

describe('Chat routes', () => {
  it('should allow an authenticated user to post and fetch messages', async () => {
    // register a fresh user
    const email = `user${Date.now()}@test.com`;
    const password = 'password';
    await request(app)
      .post('/api/auth/register')
      .send({ email, password, name: 'User' });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeTruthy();

    // post a message
    const postRes = await request(app)
      .post('/api/chat/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Olá mundo' });
    expect(postRes.status).toBe(201);
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.text).toBe('Olá mundo');

    // fetch messages
    const getRes = await request(app)
      .get('/api/chat/messages')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.some((m: any) => m.text === 'Olá mundo')).toBe(true);
  });
});
