import * as Yup from 'yup';
import Author from '../models/Author';

class AuthorController {
  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;
    const authors = await Author.findAll({
      where: {
        status: true,
      },
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'name', 'email'],
    });

    return res.json(authors);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação de entrada de dados' });
    }

    const authorExists = await Author.findOne({
      where: { email: req.body.email },
    });

    if (authorExists) {
      return res.status(400).send({ error: 'Este e-mail já existe' });
    }

    const { id, name, email } = await Author.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new AuthorController();
