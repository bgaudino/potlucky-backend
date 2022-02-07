const mongoose = require('mongoose');

const potluckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  host: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
  },
}, {
  timestamps: true,
})

const Potluck = mongoose.model('Potluck', potluckSchema);

module.exports = Potluck;