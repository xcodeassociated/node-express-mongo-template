import { Request, Response } from 'express';
import { Role, RoleInput } from '../models/role.model';
import { getPageFromRequest, getSort, Page } from "./requestTypes";

const createRole = async (req: Request, res: Response) => {
  const { description, name } = req.body;

  if (!name || !description) {
    return res.status(422).contentType('application/json').json({ message: 'The fields name and description are required' });
  }

  const roleInput: RoleInput = {
    name,
    description,
  };

  const roleCreated = await Role.create(roleInput);

  return res.status(201).contentType('application/json').json(roleCreated);
};

const getAllRoles = async (req: Request, res: Response) => {
  const pageRequest: Page = getPageFromRequest(req);
  const parsedSort: string = getSort(pageRequest.sort, pageRequest.direction);

  const roles = await Role.find()
    .limit(pageRequest.size)
    .skip(pageRequest.size * pageRequest.page)
    .sort(parsedSort)
    .exec();

  return res.status(200).contentType('application/json').json(roles);
};

const getRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  const role = await Role.findOne({ _id: id });

  if (!role) {
    return res
      .status(404)
      .contentType('application/json')
      .json({ message: `Role with id "${id}" not found.` });
  }

  return res.status(200).contentType('application/json').json(role);
};

const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, name } = req.body;

  const role = await Role.findOne({ _id: id });

  if (!role) {
    return res
      .status(404)
      .contentType('application/json')
      .json({ message: `Role with id "${id}" not found.` });
  }

  if (!name || !description) {
    return res.status(422).contentType('application/json').json({ message: 'The fields name and description are required' });
  }

  await Role.updateOne({ _id: id }, { name, description });

  const roleUpdated = await Role.findById(id, { name, description });

  return res.status(200).contentType('application/json').json(roleUpdated);
};

const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Role.findByIdAndDelete(id);

  return res.status(200).contentType('application/json').json({ message: 'Role deleted successfully.' });
};

export { createRole, deleteRole, getAllRoles, getRole, updateRole };
