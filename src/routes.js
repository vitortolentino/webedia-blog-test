import { Router } from 'express';

import { AuthorController } from './app/controllers';

const routes = new Router();

routes.post('/author', AuthorController.store);

export default routes;
