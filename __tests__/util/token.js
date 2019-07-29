import request from 'supertest';
import factories from '../factories';
import app from '../../src/app';

export default async (author = null) => {
  const serverApplication = await request(app);
  const { email, password, id } =
    author || (await factories.create('Author')).dataValues;

  const {
    body: { token },
  } = await serverApplication.post('/session').send({
    email,
    password,
  });

  return `Bearer ${token}`;
};
