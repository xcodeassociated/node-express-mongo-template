import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser, countUsers } from '../controllers/user.controller';

const userRoute = () => {
  const router = Router();

  router.post('/users', createUser);
  router.get('/users', getAllUsers);
  router.get('/users/:id', getUser);
  router.put('/users/:id', updateUser);
  router.delete('/users/:id', deleteUser);
  router.get('/usersCount', countUsers);

  return router;
};

export { userRoute };
