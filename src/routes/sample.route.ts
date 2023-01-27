import { Router } from 'express';
import { postHandler, getHandler, putHandler, deleteHandler } from '../controllers/sample.controller';

const sampleRoute = () => {
  const router = Router();

  router.post('/sample', postHandler);

  router.get('/sample/:id', getHandler);

  router.put('/sample/:id', putHandler);

  router.delete('/sample/:id', deleteHandler);

  return router;
};

export { sampleRoute };
