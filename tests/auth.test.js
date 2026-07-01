import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { createCompanyWithUser, authHeader } from './helpers.js';

describe('Auth', () => {
  it('registra un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ email: 'nuevo@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.user.email).toBe('nuevo@test.com');
    expect(res.body.data.acessToken).toBeDefined();
  });

  it('rechaza registro con email duplicado y verificado', async () => {
    const { user } = await createCompanyWithUser({ email: 'dup@test.com' });
    user.status = 'verified';
    await user.save();

    const res = await request(app)
      .post('/api/user/register')
      .send({ email: 'dup@test.com', password: 'password123' });

    expect(res.status).toBe(409);
  });

  it('rechaza registro con password corta', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ email: 'corto@test.com', password: '123' });

    expect(res.status).toBe(400);
  });

  it('hace login con credenciales correctas', async () => {
    const { user, password } = await createCompanyWithUser({ email: 'login@test.com' });

    const res = await request(app)
      .post('/api/user/login')
      .send({ email: user.email, password });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('rechaza login con password incorrecta', async () => {
    const { user } = await createCompanyWithUser({ email: 'malapass@test.com' });

    const res = await request(app)
      .post('/api/user/login')
      .send({ email: user.email, password: 'incorrecta123' });

    expect(res.status).toBe(401);
  });

  it('devuelve 401 al pedir el perfil sin token', async () => {
    const res = await request(app).get('/api/user');
    expect(res.status).toBe(401);
  });

  it('devuelve el perfil autenticado', async () => {
    const { token, user } = await createCompanyWithUser({ email: 'perfil@test.com' });

    const res = await request(app).get('/api/user').set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(user.email);
  });

  it('rechaza token inválido', async () => {
    const res = await request(app)
      .get('/api/user')
      .set(authHeader('token-falso'));

    expect(res.status).toBe(401);
  });
});