import { Router } from 'express';

import { AuthorController, ArticleController } from './app/controllers';

const routes = new Router();

routes.get('/author', AuthorController.index);
routes.post('/author', AuthorController.store);

routes.post('/article', ArticleController.store);

export default routes;
