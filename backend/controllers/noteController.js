const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const Ticket = require('../models/TicketModel');
const Note = require('../models/NoteModel');

const getNotes = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  const ticket = await Ticket.findById(req.params.ticketId);

  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  if (ticket.user.toString() !== user._id.toString()) {
    return next(new AppError('User not authorised to view this ticket', 401));
  }

  const notes = await Note.find({ ticket: req.params.ticketId });

  if (!notes) {
    return next(new AppError('Notes not found', 404));
  }

  res.status(201).json({ status: 'success', notes });
});

const addNote = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('User not logged in', 401));
  }

  const ticket = await Ticket.findById(req.params.ticketId);

  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  if (ticket.user.toString() !== user._id.toString()) {
    return next(new AppError('User not authorised to view this ticket', 401));
  }

  const note = await Note.create({
    text: req.body.text,
    ticket: req.params.ticketId,
    user: req.user._id,
  });

  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  res.status(201).json({ status: 'success', note });
});

module.exports = { getNotes, addNote };
