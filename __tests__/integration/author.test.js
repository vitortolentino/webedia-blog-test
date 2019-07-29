/* instanbu */
import request from 'supertest';
import { expect } from 'chai';
import { internet, lorem, random } from 'faker';

import app from '../../src/app';
import factories from '../factories';
import truncate from '../util/truncate';
import generateToken from '../util/token';
import { Author } from '../../src/app/models';

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

  describe('store', () => {
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

  describe('index', () => {
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

    it('should respond an array with size 20', async () => {
      const maxSize = 20;
      for (let index = 0; index < maxSize; index++) {
        await this.app
          .post('/author')
          .send(await factories.create('Author').dataValues);
      }
      const { body: authorArray } = await this.app.get('/author');
      expect(authorArray).to.have.lengthOf(maxSize);
    });

    it('should respond two identical arrays', async () => {
      for (let index = 0; index < 20; index++) {
        await this.app
          .post('/author')
          .send(await factories.create('Author').dataValues);
      }

      const { body: authorArrayPageOne } = await this.app.get(
        '/author?limit=10'
      );
      const { body: authorArrayPageTwo } = await this.app.get(
        '/author?limit=10&page=1'
      );

      expect(authorArrayPageOne).to.be.deep.equal(authorArrayPageTwo);
    });

    it('should respond two different arrays', async () => {
      for (let index = 0; index < 20; index++) {
        await this.app
          .post('/author')
          .send(await factories.create('Author').dataValues);
      }

      const { body: authorArrayPageOne } = await this.app.get(
        '/author?limit=10'
      );
      const { body: authorArrayPageTwo } = await this.app.get(
        '/author?limit=10&page=2'
      );

      expect(authorArrayPageOne).not.to.be.deep.equal(authorArrayPageTwo);
    });
  });

  describe('delete', () => {
    it('should respond status 400 if id is NaN', async () => {
      const token = await generateToken();
      const { status } = await this.app
        .delete('/author/someThing')
        .set('Authorization', token);

      expect(status).to.be.equal(400);
    });

    it('should respond status 401 if author_id does not match with id', async () => {
      const token = await generateToken();
      const { dataValues: authorMock } = await factories.create('Author');
      const { status } = await this.app
        .delete(`/author/${authorMock.id}`)
        .set('Authorization', token);

      expect(status).to.be.equal(401);
    });

    it('should respond status 200 with correct id and token', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      const { status } = await this.app
        .delete(`/author/${authorMock.id}`)
        .set('Authorization', token);

      expect(status).to.be.equal(200);
    });

    it('should not contains deleted author in list of active authors id', async () => {
      await factories.create('Author');
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      await this.app
        .delete(`/author/${authorMock.id}`)
        .set('Authorization', token);

      const authorsArray = await Author.findAll({
        raw: true,
        where: {
          status: true,
        },
        attributes: ['id'],
      });
      expect(authorsArray).to.not.have.deep.include({ id: authorMock.id });
    });
  });

  describe('update', () => {
    it('should respond status 200 with a valid author', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      const { status } = await this.app
        .put(`/author/${authorMock.id}`)
        .set('Authorization', token)
        .send({
          name: 'Other Name',
          email: 'new@email.com',
        });

      expect(status).to.be.equal(200);
    });

    it('should respond status 400 if name is empty', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      const { status } = await this.app
        .put(`/author/${authorMock.id}`)
        .set('Authorization', token)
        .send({
          name: '',
          email: authorMock.email,
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status 400 if email is empty', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      const { status } = await this.app
        .put(`/author/${authorMock.id}`)
        .set('Authorization', token)
        .send({
          name: authorMock.name,
          email: '',
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status 400 if id is NaN', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      const { status } = await this.app
        .put(`/author/someThing`)
        .set('Authorization', token)
        .send({
          name: authorMock.name,
          email: authorMock.email,
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status 400 if author not exists', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      const { status } = await this.app
        .put(`/author/${authorMock.id + 1}`)
        .set('Authorization', token)
        .send({
          name: authorMock.name,
          email: authorMock.email,
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status a object with name, id and email properties', async () => {
      const { dataValues: authorMock } = await factories.create('Author');
      const token = await generateToken(authorMock);
      const { body } = await this.app
        .put(`/author/${authorMock.id}`)
        .set('Authorization', token)
        .send({
          name: authorMock.name,
          email: authorMock.email,
        });

      expect(body)
        .to.be.a('object')
        .that.have.all.keys(['email', 'name', 'id']);
    });
  });
});
