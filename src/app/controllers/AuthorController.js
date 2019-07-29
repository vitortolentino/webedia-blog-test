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

    if (Number(req.author_id) !== Number(req.params.id)) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão de remover outro autor' });
    }

    const author = await Author.findByPk(req.params.id);
    if (!author) {
      return res.status(400).json({ error: 'Autor não encontrado' });
    }

    await author.update({
      status: false,
    });

    return res.status(200).send();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      id: Yup.number().required(),
    });

    if (!(await schema.isValid({ ...req.body, id: req.params.id }))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação de entrada de dados' });
    }

    const author = await Author.findByPk(req.params.id);
    if (!author) {
      return res.status(400).json({ error: 'Autor não encontrado' });
    }

    const { email, name } = req.body;
    await author.update({
      email,
      name,
    });
    return res.status(200).json({ email, name, id: req.params.id });
  }
}

export default new AuthorController();
