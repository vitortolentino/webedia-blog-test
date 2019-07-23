import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.send('Hello world'));

export default routes;
