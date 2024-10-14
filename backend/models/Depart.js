const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

// Export the model
const DepartmentModel = mongoose.model('department', DepartmentSchema);

module.exports = DepartmentModel;
