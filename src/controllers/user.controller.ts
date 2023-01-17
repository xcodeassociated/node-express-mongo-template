import { Request, Response } from 'express';

import { User, UserInput } from '../models/user.model';

const createUser = async (req: Request, res: Response) => {
  const { email, name, role } = req.body;

  if (!email || !name || !role) {
    return res.status(422).json({ error: 'incorrect request' });
  }

  const userInput: UserInput = { name, email, role };

  const userCreated = await User.create(userInput);

  return res.status(201).json(userCreated);
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().populate('role').sort('-createdAt').exec();

  return res.status(200).json(users);
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).populate('role').exec();

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  return res.status(200).json(user);
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, role } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  if (!name || !role || !email) {
    return res.status(422).json({ message: 'Incorrect request' });
  }

  await User.updateOne({ _id: id }, { name, email, role });

  const userUpdated = await User.findById(id);

  return res.status(200).json(userUpdated);
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).json({ message: 'User deleted successfully.' });
};

export { createUser, deleteUser, getAllUsers, getUser, updateUser };
