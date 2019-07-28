import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app';
import factories from '../factories';
import truncate from '../util/truncate';

describe('Article', () => {
  afterAll(truncate);

  beforeAll(async () => {
    this.app = await request(app);
  });

  beforeEach(async () => {
    truncate();
    const article = (await factories.build('Article')).dataValues;
    const { id: author_id } = (await factories.create('Author')).dataValues;
    this.article = {
      author_id,
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
    };
  });

  describe('store method', () => {
    it('should respond with status 400 if title is empty', async () => {
      const { status } = await this.app.post('/article').send({
        ...this.article,
        title: '',
      });

      expect(status).to.be.equal(400);
    });

    it('should respond with status 400 if subtitle is empty', async () => {
      const { status } = await this.app.post('/article').send({
        ...this.article,
        subtitle: '',
      });

      expect(status).to.be.equal(400);
    });

    it('should respond with status 400 if content is empty', async () => {
      const { status } = await this.app.post('/article').send({
        ...this.article,
        content: '',
      });

      expect(status).to.be.equal(400);
    });

    it('should respond with status 400 if author_id is not informed', async () => {
      const { status } = await this.app.post('/article').send({
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
      const { status } = await this.app
        .post('/article')
        .send({ ...this.article });

      expect(status).to.be.equal(200);
    });

    it('should respond an object with id property', async () => {
      const { body: article } = await this.app
        .post('/article')
        .send({ ...this.article });

      expect(article).to.have.property('id');
    });
  });
});
