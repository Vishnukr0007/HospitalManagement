const mongoose = require('mongoose');

// Define Employee schema
const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: {  // Fixed typo (dod to dob)
        type: Date,
        required: true
    },
    appointmentDate: { // Consistent with frontend form
        type: Date,
        required: true
    },
    joiningDate: { // Consistent with frontend form
        type: Date,
        required: true
    }
});

// Create Employee model
const EmployeeModel = mongoose.model('employees', EmployeeSchema);

module.exports = EmployeeModel;
