import { Router } from 'express';

import {
  AuthorController,
  ArticleController,
  SessionController,
} from './app/controllers';
import auth from '../src/app/middlewares/auth';

const routes = new Router();

routes.get('/author', AuthorController.index);
routes.post('/author', AuthorController.store);

routes.post('/session', SessionController.store);

routes.use('/', auth);

routes.post('/article', ArticleController.store);
routes.delete('/author/:id', AuthorController.delete);

export default routes;
