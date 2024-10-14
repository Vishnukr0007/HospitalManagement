const mongoose = require('mongoose');

const doctorHeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

// Export the model
const DoctorHead = mongoose.model('DoctorHead', doctorHeadSchema);

module.exports = DoctorHead;
