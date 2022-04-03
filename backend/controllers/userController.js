const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please include all required fields', 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new AppError('User already exists', 400));
  }

  user = await User.create({ name, email, password });

  if (!user) {
    return next(new AppError('Unable to create user', 404));
  }

  const token = user.getSignedJwtToken();

  user.password = user.active = undefined;

  res.status(200).json({ status: 'success', user, token });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please include all required fields', 400));
  }

  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(
      new AppError('Unable to login, please check your credentials.', 400)
    );
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new AppError('Invalid credentials, please try again.', 400));
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({ status: 'success', user, token });
});

exports.getMe = asyncHandler(async function (req, res, next) {
  const user = req.user;

  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  res.status(200).json({ status: 'success', user });
});
