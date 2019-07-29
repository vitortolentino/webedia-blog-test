import * as Yup from 'yup';
import { Article, Author } from '../models';

class ArticleController {
  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;
    const articles = await Article.findAll({
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'title', 'subtitle', 'content'],
      include: [
        {
          model: Author,
          as: 'author',
          where: {
            status: true,
          },
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(articles);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      subtitle: Yup.string().required(),
      content: Yup.string().required(),
      author_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação de entrada de dados' });
    }

    const article = await Article.create(req.body);

    return res.json(article);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      author_id: Yup.number().required(),
    });

    const inputData = {
      ...req.params,
      author_id: req.author_id,
    };

    if (!(await schema.isValid(inputData))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação de entrada de dados' });
    }

    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(400).json({ error: 'Artigo não encontrado' });
    }

    if (Number(article.author_id) !== Number(req.author_id)) {
      return res.status(401).json({
        error: 'Você não tem permissão de remover um artigo de outro autor',
      });
    }

    await article.destroy();

    return res.status(200).send();
  }
}

export default new ArticleController();
