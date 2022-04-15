const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');
const ticketRouter = require('./routes/ticketRoutes');
const AppError = require('./utils/AppError');
const GobalErrorHandler = require('./controllers/errorController');
const connectDB = require('./config/db');

const app = express();

dotenv.config({ path: '.env.dev' });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to Support Desk API' });
});

app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

app.use(GobalErrorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);

  console.log(`UNHANDLER REJECTION! Shutting down...`);

  server.close(() => {
    process.exit(1);
  });
});
