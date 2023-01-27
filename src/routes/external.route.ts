import { Router } from 'express';
import { extPostHandler, extGetHandler, extPutHandler, extDeleteHandler } from '../controllers/external.controller';

const externalRoute = () => {
  const router = Router();

  router.post('/external/', extPostHandler);

  router.get('/external/:id', extGetHandler);

  router.put('/external/:id', extPutHandler);

  router.delete('/external/:id', extDeleteHandler);

  return router;
};

export { externalRoute };
