const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  avatarUrl: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  gender: Boolean,
  token: String,
});

module.exports = mongoose.model('User', userSchema);
