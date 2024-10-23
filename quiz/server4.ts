import express, { Express } from 'express';
import cors from 'cors';
import readUsersRouter from './readUsers';
import writeUsersRouter from './writeUsers';

const app: Express = express();
const port = 8000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the modularized routers
app.use('/read', readUsersRouter);
app.use('/write', writeUsersRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
