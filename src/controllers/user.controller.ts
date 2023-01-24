import { Request, Response } from 'express';

import { User, UserInput } from '../models/user.model';
import { eventEmitter } from '../ApplicationEvents';
import { getPageFromRequest, getSort, Page } from './requestTypes';

const createUser = async (req: Request, res: Response) => {
  const { email, name, role } = req.body;

  if (!email || !name || !role) {
    return res.status(422).json({ error: 'incorrect request' });
  }

  const userInput: UserInput = { name, email, role };

  const userCreated = await User.create(userInput);

  eventEmitter.emit('user_created', userCreated._id);

  return res.status(201).contentType('application/json').json(userCreated);
};

const getAllUsers = async (req: Request, res: Response) => {
  const pageRequest: Page = getPageFromRequest(req);
  const parsedSort: string = getSort(pageRequest.sort, pageRequest.direction);

  const users = await User.find()
    .populate('role')
    .limit(pageRequest.size)
    .skip(pageRequest.size * pageRequest.page)
    .sort(parsedSort)
    .exec();

  return res.status(200).contentType('application/json').json(users);
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).populate('role').exec();

  if (!user) {
    return res
      .status(404)
      .contentType('application/json')
      .json({ message: `User with id "${id}" not found.` });
  }

  return res.status(200).contentType('application/json').json(user);
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, role } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res
      .status(404)
      .contentType('application/json')
      .json({ message: `User with id "${id}" not found.` });
  }

  if (!name || !role || !email) {
    return res.status(422).contentType('application/json').json({ message: 'Incorrect request' });
  }

  await User.updateOne({ _id: id }, { name, email, role });

  const userUpdated = await User.findById(id);

  return res.status(200).contentType('application/json').json(userUpdated);
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).contentType('application/json').json({ message: 'User deleted successfully.' });
};

export { createUser, deleteUser, getAllUsers, getUser, updateUser };
