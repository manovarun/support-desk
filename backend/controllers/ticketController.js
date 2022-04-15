const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const Ticket = require('../models/TicketModel');

exports.getTickets = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  const tickets = await Ticket.find({ user });

  res.status(200).json({ status: 'success', tickets });
});

exports.createTicket = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  const { product, description } = req.body;

  if (!product || !description) {
    return next(new AppError('Enter product or description', 400));
  }

  const ticket = await Ticket.create({ product, description, user: user._id });

  if (!ticket) {
    return next(new AppError('Unable to create ticket', 400));
  }

  res.status(201).json({ status: 'success', ticket });
});

exports.getTicket = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  if (ticket.user.toString() !== user._id.toString()) {
    return next(new AppError('User not authorised to view this ticket', 401));
  }

  res.status(201).json({ status: 'success', ticket });
});

exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  if (ticket.user.toString() !== user._id.toString()) {
    return next(new AppError('User not authorised to view this ticket', 401));
  }

  await ticket.remove();

  res.status(204).json({ status: 'success' });
});

exports.updateTicket = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ status: 'success', ticket });
});
