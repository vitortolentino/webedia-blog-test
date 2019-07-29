import request from 'supertest';
import { expect } from 'chai';
import { lorem } from 'faker';

import app from '../../src/app';
import factories from '../factories';
import truncate from '../util/truncate';
import generateToken from '../util/token';
import { Article } from '../../src/app/models';

describe('Article', () => {
  afterAll(truncate);

  beforeAll(async () => {
    this.app = await request(app);
  });

  beforeEach(async () => {
    truncate();
    const article = (await factories.build('Article')).dataValues;
    this.author = (await factories.create('Author')).dataValues;
    this.article = {
      author_id: this.author.id,
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
    };
  });

  describe('store', () => {
    it('should respond with status 400 if title is empty', async () => {
      const token = await generateToken(this.author);
      const { status } = await this.app
        .post('/article')
        .set('Authorization', token)
        .send({
          ...this.article,
          title: '',
        });

      expect(status).to.be.equal(400);
    });

    it('should respond with status 400 if subtitle is empty', async () => {
      const token = await generateToken(this.author);
      const { status } = await this.app
        .post('/article')
        .set('Authorization', token)
        .send({
          ...this.article,
          subtitle: '',
        });

      expect(status).to.be.equal(400);
    });

    it('should respond with status 400 if content is empty', async () => {
      const token = await generateToken(this.author);
      const { status } = await this.app
        .post('/article')
        .set('Authorization', token)
        .send({
          ...this.article,
          content: '',
        });

      expect(status).to.be.equal(400);
    });

    it('should respond with status 400 if author_id is not informed', async () => {
      const token = await generateToken(this.author);
      const { status } = await this.app
        .post('/article')
        .set('Authorization', token)
        .send({
          ...this.article,
          author_id: undefined,
        });

      expect(status).to.be.equal(400);
    });

    it('should respond an object with error property not', async () => {
      const { body } = await this.app.post('/article').send({
        ...this.article,
        content: '',
      });

      expect(body).to.be.have.property('error').that.does.not.be.empty;
    });

    it('should be able to register an Article', async () => {
      const token = await generateToken(this.author);
      const { status } = await this.app
        .post('/article')
        .set('Authorization', token)
        .send({ ...this.article });

      expect(status).to.be.equal(200);
    });

    it('should respond an object with id property', async () => {
      const token = await generateToken(this.author);
      const { body: article } = await this.app
        .post('/article')
        .set('Authorization', token)
        .send({ ...this.article });

      expect(article).to.have.property('id');
    });
  });

  describe('index', () => {
    it('should respond an array', async () => {
      const { body } = await this.app.get('/article');

      expect(body).to.be.an('array');
    });

    it('should respond an array with an valid article', async () => {
      const article = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });

      const { body: articleArray } = await this.app.get('/article');

      expect(articleArray[0].id).to.be.equal(article.id);
    });

    it('should respond status 200 with valid params', async () => {
      const { status } = await this.app.get('/article');

      expect(status).to.be.equal(200);
    });

    it('should respond an array with size 20', async () => {
      const maxSize = 20;
      for (let index = 0; index < maxSize + 5; index++) {
        await Article.create({
          title: lorem.word(),
          subtitle: lorem.words(),
          content: lorem.text(),
          author_id: this.author.id,
        });
      }
      const { body: articleArray } = await this.app.get('/article');

      expect(articleArray).to.have.lengthOf(maxSize);
    }, 30000);

    it('should respond two identical arrays', async () => {
      for (let index = 0; index < 20; index++) {
        await Article.create({
          title: lorem.word(),
          subtitle: lorem.words(),
          content: lorem.text(),
          author_id: this.author.id,
        });
      }

      const { body: articleArrayPageOne } = await this.app.get(
        '/article?limit=10'
      );
      const { body: articleArrayPageTwo } = await this.app.get(
        '/article?limit=10&page=1'
      );

      expect(articleArrayPageOne).to.be.deep.equal(articleArrayPageTwo);
    }, 30000);

    it('should respond two different arrays', async () => {
      for (let index = 0; index < 20; index++) {
        await Article.create({
          title: lorem.word(),
          subtitle: lorem.words(),
          content: lorem.text(),
          author_id: this.author.id,
        });
      }

      const { body: articleArrayPageOne } = await this.app.get(
        '/article?limit=10'
      );
      const { body: articleArrayPageTwo } = await this.app.get(
        '/article?limit=10&page=2'
      );

      expect(articleArrayPageOne).not.to.be.deep.equal(articleArrayPageTwo);
    }, 30000);
  });
});
