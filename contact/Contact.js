const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.includes('@');
      },
      message: props => `${props.value} must have @!`,
    },
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subscription: String,

  password: String,

  token: String,
});

module.exports = mongoose.model('Contact', contactSchema);
