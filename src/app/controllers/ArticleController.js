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
}

export default new ArticleController();
