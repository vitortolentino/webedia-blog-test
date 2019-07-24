import request from 'supertest';
import app from '../../src/app';

import { expect } from 'chai';

import truncate from '../util/truncate';

describe('Author', () => {
  beforeAll(async () => {
    this.app = await request(app);
  });

  beforeEach(async () => {
    await truncate();
  });

  describe('store method', () => {
    it('should respond an object', async () => {
      const result = await this.app.post('/author').send({
        name: 'Vitor',
        email: 'vitorafonso123@gmail.com',
        password: '123456',
      });

      expect(result.body).to.be.an('object');
    });

    it('should be able to register a Author', async () => {
      const result = await this.app.post('/author').send({
        name: 'Vitor',
        email: 'vitorafonso1@gmail.com',
        password: '123456',
      });

      expect(result.body).to.have.property('id');
    });

    it('should not be able to register with duplicated e-mail', async () => {
      await this.app.post('/author').send({
        name: 'Vitor',
        email: 'vitorafonso1@gmail.com',
        password: '123456',
      });

      const result = await this.app.post('/author').send({
        name: 'Vitor',
        email: 'vitorafonso1@gmail.com',
        password: '123456',
      });

      expect(result.status).to.be.equal(400);
    });

    it('should not be able to register with invalid e-mail', async () => {
      const result = await this.app.post('/author').send({
        name: 'Vitor',
        email: 'vitorafonso1gmail.com',
        password: '123456',
      });

      expect(result.status).to.be.equal(400);
    });

    it('should not be able to register with invalid password', async () => {
      const result = await this.app.post('/author').send({
        name: 'Vitor',
        email: 'vitorafonso1gmail.com',
        password: '12345',
      });

      expect(result.status).to.be.equal(400);
    });

    it('should not be able to register with empty name', async () => {
      const result = await this.app.post('/author').send({
        name: 'Vitor',
        email: 'vitorafonso1@gmail.com',
        password: '1234',
      });

      expect(result.status).to.be.equal(400);
    });
  });

  describe('index method', () => {
    it('should respond an array', async () => {
      const result = await this.app.get('/author');

      expect(result.body).to.be.an('array');
    });

    // it('should respond an array with an valid author', async () => {
    //   await truncate();

    //   const { body: author } = await this.app.post('/author').send({
    //     name: 'Vitor',
    //     email: 'vitorafonso123@gmail.com',
    //     password: '123456',
    //   });

    //   const { body: author2 } = await this.app.post('/author').send({
    //     name: 'Vitor',
    //     email: 'vitorafonso1234@gmail.com',
    //     password: '123456',
    //   });

    //   const { body: authorArray } = await this.app.get('/author');

    //   console.log(authorArray, author, author2);

    //   expect({}).to.be.deep.equal({});
    // });
  });
});
