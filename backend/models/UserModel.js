const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 6,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  this.token = token;

  return token;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
