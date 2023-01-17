import { Router } from 'express';
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from '../controllers/role.controller';

const roleRoute = () => {
  const router = Router();

  router.post('/permissions', createRole);

  router.get('/permissions', getAllRoles);

  router.get('/permissions/:id', getRole);

  router.put('/permissions/:id', updateRole);

  router.delete('/permissions/:id', deleteRole);

  return router;
};

export { roleRoute };
