import { Router } from 'express';

import { AuthorController } from './app/controllers';

const routes = new Router();

routes.get('/author', AuthorController.index);
routes.post('/author', AuthorController.store);

export default routes;
