import request from 'supertest';
import app from '../src/app.js';
import Client from '../src/models/Client.js';
import Project from '../src/models/Project.js';
import { createCompanyWithUser, authHeader } from './helpers.js';

const createClientAndProject = async (companyId, userId) => {
  const client = await Client.create({
    user: userId,
    company: companyId,
    name: 'Cliente DN',
    cif: `B${Date.now()}${Math.floor(Math.random() * 1000)}`,
  });

  const project = await Project.create({
    user: userId,
    company: companyId,
    client: client._id,
    name: 'Proyecto DN',
    projectCode: `PDN-${Date.now()}`,
  });

  return { client, project };
};

describe('DeliveryNote', () => {
  it('crea un albarán de tipo material', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const { client, project } = await createClientAndProject(company._id, user._id);

    const res = await request(app)
      .post('/api/deliverynote')
      .set(authHeader(token))
      .send({
        client: client._id.toString(),
        project: project._id.toString(),
        format: 'material',
        workDate: '2026-01-10',
        material: 'Cemento',
        quantity: 10,
        unit: 'sacos',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.deliveryNote.format).toBe('material');
  });

  it('crea un albarán de tipo horas con varios trabajadores', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const { client, project } = await createClientAndProject(company._id, user._id);

    const res = await request(app)
      .post('/api/deliverynote')
      .set(authHeader(token))
      .send({
        client: client._id.toString(),
        project: project._id.toString(),
        format: 'hours',
        workDate: '2026-01-12',
        hours: 16,
        workers: [
          { name: 'Juan', hours: 8 },
          { name: 'Ana', hours: 8 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.deliveryNote.workers).toHaveLength(2);
  });

  it('filtra albaranes por formato y firmado', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const { client, project } = await createClientAndProject(company._id, user._id);

    await request(app)
      .post('/api/deliverynote')
      .set(authHeader(token))
      .send({
        client: client._id.toString(),
        project: project._id.toString(),
        format: 'hours',
        workDate: '2026-01-15',
        hours: 5,
      });

    const res = await request(app)
      .get('/api/deliverynote?format=hours&signed=false')
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.data.deliveryNotes).toHaveLength(1);
  });

  it('descarga el PDF de un albarán no firmado', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const { client, project } = await createClientAndProject(company._id, user._id);

    const createRes = await request(app)
      .post('/api/deliverynote')
      .set(authHeader(token))
      .send({
        client: client._id.toString(),
        project: project._id.toString(),
        format: 'material',
        workDate: '2026-01-20',
        material: 'Ladrillos',
        quantity: 200,
        unit: 'uds',
      });

    const id = createRes.body.data.deliveryNote._id;

    const res = await request(app).get(`/api/deliverynote/pdf/${id}`).set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
  });

  it('no permite borrar un albarán firmado', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const { client, project } = await createClientAndProject(company._id, user._id);

    const createRes = await request(app)
      .post('/api/deliverynote')
      .set(authHeader(token))
      .send({
        client: client._id.toString(),
        project: project._id.toString(),
        format: 'hours',
        workDate: '2026-01-22',
        hours: 3,
      });

    const id = createRes.body.data.deliveryNote._id;

    const DeliveryNote = (await import('../src/models/DeliveryNote.js')).default;
    await DeliveryNote.findByIdAndUpdate(id, { signed: true, signedAt: new Date() });

    const res = await request(app).delete(`/api/deliverynote/${id}`).set(authHeader(token));

    expect(res.status).toBe(400);
  });

  it('no permite crear un albarán con proyecto de otra compañía', async () => {
    const { token, user, company } = await createCompanyWithUser();
    const { token: tokenB } = await createCompanyWithUser({ email: 'otra@test.com' });
    const { client, project } = await createClientAndProject(company._id, user._id);

    const res = await request(app)
      .post('/api/deliverynote')
      .set(authHeader(tokenB))
      .send({
        client: client._id.toString(),
        project: project._id.toString(),
        format: 'material',
        workDate: '2026-01-25',
        material: 'Arena',
        quantity: 5,
        unit: 'sacos',
      });

    expect(res.status).toBe(400);
  });
});