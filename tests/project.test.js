import request from 'supertest';
import app from '../src/app.js';
import Client from '../src/models/Client.js';
import { createCompanyWithUser, authHeader } from './helpers.js';

const createClient = async (companyId, userId, overrides = {}) =>
  Client.create({
    user: userId,
    company: companyId,
    name: 'Cliente Base',
    cif: `B${Date.now()}${Math.floor(Math.random() * 1000)}`,
    ...overrides,
  });

describe('Project', () => {
  it('crea un proyecto asociado a un cliente existente', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const client = await createClient(company._id, user._id);

    const res = await request(app)
      .post('/api/project')
      .set(authHeader(token))
      .send({ name: 'Reforma', projectCode: 'PRJ-001', client: client._id.toString() });

    expect(res.status).toBe(201);
    expect(res.body.data.project.projectCode).toBe('PRJ-001');
  });

  it('rechaza crear proyecto con cliente inexistente', async () => {
    const { token } = await createCompanyWithUser();

    const res = await request(app)
      .post('/api/project')
      .set(authHeader(token))
      .send({ name: 'Reforma', projectCode: 'PRJ-002', client: '665f1a2b3c4d5e6f7a8b9c0d' });

    expect(res.status).toBe(400);
  });

  it('rechaza projectCode duplicado en la misma compañía', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const client = await createClient(company._id, user._id);

    await request(app)
      .post('/api/project')
      .set(authHeader(token))
      .send({ name: 'Proyecto 1', projectCode: 'DUP-001', client: client._id.toString() });

    const res = await request(app)
      .post('/api/project')
      .set(authHeader(token))
      .send({ name: 'Proyecto 2', projectCode: 'DUP-001', client: client._id.toString() });

    expect(res.status).toBe(409);
  });

  it('filtra proyectos por cliente', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const clientA = await createClient(company._id, user._id, { cif: 'B00000001' });
    const clientB = await createClient(company._id, user._id, { cif: 'B00000002' });

    await request(app)
      .post('/api/project')
      .set(authHeader(token))
      .send({ name: 'Proyecto A', projectCode: 'PA-001', client: clientA._id.toString() });
    await request(app)
      .post('/api/project')
      .set(authHeader(token))
      .send({ name: 'Proyecto B', projectCode: 'PB-001', client: clientB._id.toString() });

    const res = await request(app)
      .get(`/api/project?client=${clientA._id.toString()}`)
      .set(authHeader(token));

    expect(res.body.data.projects).toHaveLength(1);
    expect(res.body.data.projects[0].projectCode).toBe('PA-001');
  });

  it('archiva y restaura un proyecto', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const client = await createClient(company._id, user._id);

    const createRes = await request(app)
      .post('/api/project')
      .set(authHeader(token))
      .send({ name: 'Archivable', projectCode: 'ARCH-001', client: client._id.toString() });

    const id = createRes.body.data.project._id;

    await request(app).delete(`/api/project/${id}?soft=true`).set(authHeader(token));

    const restoreRes = await request(app)
      .patch(`/api/project/${id}/restore`)
      .set(authHeader(token));

    expect(restoreRes.status).toBe(200);
    expect(restoreRes.body.data.project.deleted).toBe(false);
  });
});