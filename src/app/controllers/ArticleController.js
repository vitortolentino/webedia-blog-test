import * as Yup from 'yup';
import { Article } from '../models';

class ArticleController {
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
