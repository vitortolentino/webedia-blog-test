/* instanbu */
import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app';
import auth from '../../src/app/middlewares/auth';
import truncate from '../util/truncate';

jest.setTimeout(60000);

afterAll(truncate);

beforeAll(async () => {
  this.app = await request(app);
});

beforeEach(truncate);

describe('auth', () => {
  it('should be a function', async () => {
    expect(auth).to.be.a('function');
  });

  it('should respond 401 if headers.authorization is not informed', async () => {
    const { status } = await this.app.post('/');

    expect(status).to.be.equal(401);
  });

  it('should respond 401 if occurs an error to validate token', async () => {
    const { status } = await this.app.post('/').set('Authorization', 'potato');

    expect(status).to.be.equal(401);
  });
});
