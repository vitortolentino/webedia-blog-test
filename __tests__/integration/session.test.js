/* instanbu */
import request from 'supertest';
import { expect } from 'chai';
import { internet } from 'faker';

import factories from '../factories';
import app from '../../src/app';
jest.setTimeout(60000);
describe('Session', () => {
  beforeAll(async () => {
    this.app = await request(app);
  });

  describe('store', () => {
    it('should return status 400 if email or password is not informed', async () => {
      const { status } = await this.app.post('/session');

      expect(status).to.be.equal(400);
    });

    it('should return an error property not empty if password or email is not informed', async () => {
      const { body } = await this.app.post('/session');

      expect(body).to.have.a.property('error').to.be.not.empty;
    });

    it('should return status 401 if author not exists', async () => {
      const { status } = await this.app.post('/session').send({
        email: internet.email(),
        password: internet.password(),
      });

      expect(status).to.be.equal(401);
    });

    it('should return an error property not empty if author not exists', async () => {
      const { body } = await this.app.post('/session').send({
        email: internet.email(),
        password: internet.password(),
      });

      expect(body).to.have.a.property('error').to.be.not.empty;
    });

    it('should return status 401 if password is wrong', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const { status } = await this.app.post('/session').send({
        email: authorMock.email,
        password: `${authorMock.password}wrong`,
      });

      expect(status).to.be.equal(401);
    });

    it('should return an error property not empty if password is wrong', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const { body } = await this.app.post('/session').send({
        email: authorMock.email,
        password: 'wrongPassword',
      });

      expect(body).to.have.a.property('error').to.be.not.empty;
    });

    it('should respond status 200 to correct author credentials', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const { status } = await this.app.post('/session').send({
        email: authorMock.email,
        password: authorMock.password,
      });

      expect(status).to.be.equal(200);
    });

    it('should author object that must be have email, id and name', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const { body } = await this.app.post('/session').send({
        email: authorMock.email,
        password: authorMock.password,
      });

      expect(body)
        .to.have.a.property('author')
        .that.have.all.keys(['email', 'name', 'id']);
    }, 30000);

    it('should responde a token property not empty', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const { body } = await this.app.post('/session').send({
        email: authorMock.email,
        password: authorMock.password,
      });

      expect(body).to.have.a.property('token').to.be.not.empty;
    }, 30000);
  });
});
