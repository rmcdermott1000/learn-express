import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { User, UserRequest } from './types';

const router = express.Router();

const dataFile = path.resolve(__dirname, '../data/users.json');

// Middleware to load users data
const addUsersToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  fs.readFile(dataFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load users' });
    }
    req.users = JSON.parse(data.toString()) as User[];
    next();
  });
};

// Route to add a new user
router.post('/adduser', addUsersToRequest, (req: UserRequest, res: Response) => {
  const newUser = req.body as User;
  req.users?.push(newUser);
  fs.writeFile(dataFile, JSON.stringify(req.users), (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to save user' });
    } else {
      res.json({ message: 'User added successfully' });
    }
  });
});

export default router;
