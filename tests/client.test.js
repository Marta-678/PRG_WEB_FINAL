import request from 'supertest';
import app from '../src/app.js';
import { createCompanyWithUser, authHeader } from './helpers.js';

describe('Client', () => {
  it('crea un cliente', async () => {
    const { token } = await createCompanyWithUser();

    const res = await request(app)
      .post('/api/client')
      .set(authHeader(token))
      .send({ name: 'Cliente Test', cif: 'B12345678', email: 'cliente@test.com' });

    expect(res.status).toBe(201);
    expect(res.body.data.client.name).toBe('Cliente Test');
  });

  it('rechaza crear cliente sin cif', async () => {
    const { token } = await createCompanyWithUser();

    const res = await request(app)
      .post('/api/client')
      .set(authHeader(token))
      .send({ name: 'Sin CIF' });

    expect(res.status).toBe(400);
  });

  it('rechaza CIF duplicado en la misma compañía', async () => {
    const { token } = await createCompanyWithUser();

    await request(app)
      .post('/api/client')
      .set(authHeader(token))
      .send({ name: 'Cliente 1', cif: 'B99999999' });

    const res = await request(app)
      .post('/api/client')
      .set(authHeader(token))
      .send({ name: 'Cliente 2', cif: 'B99999999' });

    expect(res.status).toBe(409);
  });

  it('lista clientes con paginación', async () => {
    const { token } = await createCompanyWithUser();

    for (let i = 0; i < 3; i += 1) {
      await request(app)
        .post('/api/client')
        .set(authHeader(token))
        .send({ name: `Cliente ${i}`, cif: `B0000000${i}` });
    }

    const res = await request(app)
      .get('/api/client?page=1&limit=2')
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.data.clients).toHaveLength(2);
    expect(res.body.data.pagination.totalItems).toBe(3);
  });

  it('archiva y restaura un cliente', async () => {
    const { token } = await createCompanyWithUser();

    const createRes = await request(app)
      .post('/api/client')
      .set(authHeader(token))
      .send({ name: 'Archivable', cif: 'B11111111' });

    const id = createRes.body.data.client._id;

    const archiveRes = await request(app)
      .delete(`/api/client/${id}?soft=true`)
      .set(authHeader(token));
    expect(archiveRes.status).toBe(200);

    const archivedList = await request(app)
      .get('/api/client/archived')
      .set(authHeader(token));
    expect(archivedList.body.data.clients).toHaveLength(1);

    const restoreRes = await request(app)
      .patch(`/api/client/${id}/restore`)
      .set(authHeader(token));
    expect(restoreRes.status).toBe(200);
    expect(restoreRes.body.data.client.deleted).toBe(false);
  });

  it('no permite ver clientes de otra compañía', async () => {
    const { token: tokenA } = await createCompanyWithUser({ email: 'a@test.com' });
    const { token: tokenB } = await createCompanyWithUser({ email: 'b@test.com' });

    const createRes = await request(app)
      .post('/api/client')
      .set(authHeader(tokenA))
      .send({ name: 'Cliente A', cif: 'B22222222' });

    const id = createRes.body.data.client._id;

    const res = await request(app)
      .get(`/api/client/${id}`)
      .set(authHeader(tokenB));

    expect(res.status).toBe(404);
  });
});