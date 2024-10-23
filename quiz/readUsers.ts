import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { UserRequest, User } from './types';

const router = express.Router();

// Middleware to load users data
const addUsersToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  const dataFile = path.resolve(__dirname, '../data/users.json');
  fs.readFile(dataFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load users' });
    }
    req.users = JSON.parse(data.toString()) as User[];
    next();
  });
};

// Route to get all usernames
router.get('/usernames', addUsersToRequest, (req: UserRequest, res: Response) => {
  const usernames = req.users?.map(user => ({
    id: user.id,
    username: user.username
  }));
  res.json(usernames);
});

// Route to get a specific user's email by username
router.get('/username/:name', addUsersToRequest, (req: UserRequest, res: Response) => {
  const username = req.params.name.toLowerCase();
  const user = req.users?.find(user => user.username.toLowerCase() === username);
  if (user) {
    res.json({ email: user.email });
  } else {
    res.status(404).json({ error: `User ${username} not found` });
  }
});

export default router;
