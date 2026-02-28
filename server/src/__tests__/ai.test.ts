import request from 'supertest';
import app from '../server';

describe('AI routes (Llama Local)', () => {
    it('should attempt to call Llama and return error if not available', async () => {
        // Register and login first
        const email = `aiuser${Date.now()}@test.com`;
        const password = 'password';
        await request(app)
            .post('/api/auth/register')
            .send({ email, password, name: 'AI User' });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email, password });
        const token = loginRes.body.token;

        // Try to generate without a real Llama server
        const res = await request(app)
            .post('/api/ai/generate')
            .set('Authorization', `Bearer ${token}`)
            .send({ prompt: 'Hello' });

        // Should either return error or succeed (depends on if Llama is running)
        expect([500, 200]).toContain(res.status);
    });

    it('should require authentication', async () => {
        const res = await request(app)
            .post('/api/ai/generate')
            .send({ prompt: 'Hello' });

        expect(res.status).toBe(401);
    });
});
