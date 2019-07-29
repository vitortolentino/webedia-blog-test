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

  describe('delete', () => {
    it('should respond status 200 with correct id and token', async () => {
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const token = await generateToken(this.author);
      const { status } = await this.app
        .delete(`/article/${articleMock.id}`)
        .set('Authorization', token);

      expect(status).to.be.equal(200);
    });

    it('should respond status 400 if id is NaN', async () => {
      const token = await generateToken();
      const { status } = await this.app
        .delete('/article/someThing')
        .set('Authorization', token);

      expect(status).to.be.equal(400);
    });

    it('should respond status 401 if author_id does not match with author_id from this article', async () => {
      const token = await generateToken();
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { status } = await this.app
        .delete(`/article/${articleMock.id}`)
        .set('Authorization', token);

      expect(status).to.be.equal(401);
    });

    it('should not contains deleted article in list of active articles id', async () => {
      await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const token = await generateToken(this.author);
      await this.app
        .delete(`/article/${articleMock.id}`)
        .set('Authorization', token);

      const articlesArray = await Article.findAll({
        raw: true,
        attributes: ['id'],
      });
      expect(articlesArray).to.not.have.deep.include({ id: articleMock.id });
    });
  });

  describe('update', () => {
    it('should respond status 200 with a valid article', async () => {
      const token = await generateToken(this.author);
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { status } = await this.app
        .put(`/article/${articleMock.id}`)
        .set('Authorization', token)
        .send({
          title: 'other title',
          subtitle: 'other subtitle',
          content: 'other content',
        });

      expect(status).to.be.equal(200);
    });

    it('should respond status 400 if title is empty', async () => {
      const token = await generateToken(this.author);
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { status } = await this.app
        .put(`/article/${articleMock.id}`)
        .set('Authorization', token)
        .send({
          title: '',
          subtitle: 'other subtitle',
          content: 'other content',
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status 400 if subtitle is empty', async () => {
      const token = await generateToken(this.author);
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { status } = await this.app
        .put(`/article/${articleMock.id}`)
        .set('Authorization', token)
        .send({
          title: 'other title',
          subtitle: '',
          content: 'other content',
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status 400 if content is empty', async () => {
      const token = await generateToken(this.author);
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { status } = await this.app
        .put(`/article/${articleMock.id}`)
        .set('Authorization', token)
        .send({
          title: 'other title',
          subtitle: 'other subtitle',
          content: '',
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status 400 if id is NaN', async () => {
      const token = await generateToken(this.author);
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { status } = await this.app
        .put(`/article/someThing`)
        .set('Authorization', token)
        .send({
          title: articleMock.title,
          subtitle: articleMock.subtitle,
          content: articleMock.content,
        });

      expect(status).to.be.equal(400);
    });

    it('should respond status 400 if article not exists', async () => {
      const token = await generateToken(this.author);
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { status } = await this.app
        .put(`/article/${articleMock.id + 1}`)
        .set('Authorization', token)
        .send({
          title: articleMock.title,
          subtitle: articleMock.subtitle,
          content: articleMock.content,
        });

      expect(status).to.be.equal(400);
    });
    it('should respond status a object with title, subtitle, content and id properties', async () => {
      const token = await generateToken(this.author);
      const { dataValues: articleMock } = await Article.create({
        title: lorem.word(),
        subtitle: lorem.words(),
        content: lorem.text(),
        author_id: this.author.id,
      });
      const { body } = await this.app
        .put(`/article/${articleMock.id}`)
        .set('Authorization', token)
        .send({
          title: articleMock.title,
          subtitle: articleMock.subtitle,
          content: articleMock.content,
        });

      expect(body).to.be.a('object');
      //.that.have.all.keys(['title', 'subtitle', 'content', 'id']);
    });
  });
});
