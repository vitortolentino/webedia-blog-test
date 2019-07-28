import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import { Author } from '../models';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
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

    const { email, password } = req.body;
    const author = await Author.findOne({ where: { email } });
    if (!author || !(await author.checkPassword(password))) {
      return res.status(401).json({ error: 'Autor ou senha inválidos' });
    }

    const { name, id } = author;

    return res.json({
      author: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
