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

// JWT AUTH
routes.use('/', auth);

// articles
routes.post('/article', ArticleController.store);

// authors
routes.delete('/author/:id', AuthorController.delete);
routes.put('/author/:id', AuthorController.update);

export default routes;
