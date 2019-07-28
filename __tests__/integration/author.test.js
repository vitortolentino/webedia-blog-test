/* instanbu */
import request from 'supertest';
import { expect } from 'chai';
import { internet, lorem } from 'faker';

import app from '../../src/app';
import factories from '../factories';
import truncate from '../util/truncate';

describe('Author', () => {
  afterAll(truncate);

  beforeAll(async () => {
    this.app = await request(app);
  });

  beforeEach(async () => {
    truncate();
    const { name, email, password } = (await factories.build(
      'Author'
    )).dataValues;

    this.author = { name, email, password };
  });

  describe('store method', () => {
    it('should be able to register a Author', async () => {
      const { status } = await this.app.post('/author').send({
        ...this.author,
      });

      expect(status).to.be.equal(200);
    });

    it('should respond an object', async () => {
      const { body: author } = await this.app.post('/author').send(this.author);

      expect(author).to.be.an('object');
    });

    it('should not be able to register with duplicated e-mail', async () => {
      const emailDuplicated = internet.email();
      await this.app.post('/author').send({
        ...this.author,
        email: emailDuplicated,
      });

      const { status } = await this.app.post('/author').send({
        name: lorem.word(),
        email: emailDuplicated,
        password: internet.password(),
      });

      expect(status).to.be.equal(400);
    });

    it('should not be able to register with invalid e-mail', async () => {
      const { status } = await this.app.post('/author').send({
        ...this.author,
        email: 'worngemail.com',
      });

      expect(status).to.be.equal(400);
    });

    it('should not be able to register with invalid password', async () => {
      const result = await this.app.post('/author').send({
        ...this.author,
        password: '12345',
      });

      expect(result.status).to.be.equal(400);
    });

    it('should not be able to register with empty name', async () => {
      const result = await this.app.post('/author').send({
        ...this.author,
        name: '',
      });

      expect(result.status).to.be.equal(400);
    });
  });

  describe('index method', () => {
    it('should respond an array', async () => {
      const result = await this.app.get('/author');

      expect(result.body).to.be.an('array');
    });

    it('should respond an array with an valid author', async () => {
      const { body: author } = await this.app
        .post('/author')
        .send({ ...this.author, email: internet.email() });

      const { body: authorArray } = await this.app.get('/author');
      expect(authorArray[0]).to.be.deep.equal(author);
    });
  });
});
