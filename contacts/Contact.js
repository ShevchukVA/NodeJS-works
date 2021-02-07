const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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
  subscription: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

contactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact', contactSchema);
