import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, mobile, role } = req.body;
  try {
    const existing = await User.findOne({ email });

    if (existing) {
      res.status(400).json({ message: 'User exists' });
      return;
    }

    const password = '123456';
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, mobile, password: hashed, role });

    await user.save();

    res.json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to user creation' });
  }
};

export const listUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('name email mobile role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getUserDetails = async (req: any, res: Response, next: NextFunction) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user information' });
  }
}

export const deleteUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      res.status(404).json({ message: 'User not found or not authorized' });
      return
    }
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name, email, mobile, role } = req.body;

  try {
    const isUserFound = await User.findOneAndUpdate({ _id: id }, { name, email, mobile, role }, { new: true });
    if (!isUserFound) {
      res.status(404).json({ message: 'User not found or not authorized' });
      return
    }
    res.json({ isUserFound });
  } catch (error) {
    next(error);
  }
};
