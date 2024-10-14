const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken"); // Missing in original code
require("dotenv").config(); // To load .env variables
const multer = require('multer');
const path = require('path');
const UserModel=require('./models/Item');
const DoctorHeads = require('./models/Head');
const DepartmentModel=require('./models/Depart')
const EmployeeModel=require('./models/Employee')
const fs = require('fs');


const PORT = process.env.PORT || 3001;
const SECRET_KEY = "jwt_secret_key";
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const users = {
  username: "user",
  password: '12345'
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === users.username && password === users.password) {
    // Create JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ensure unique file names
  }
});

const upload = multer({ storage: storage });

app.post('/DoctorFormPost', upload.single('image'), async (req, res) => {
  try {
    const { name, department, departmenthead } = req.body;
    const imagePath = req.file.path; // Path to the stored image

    // Create new user with image path
    const newUser = await UserModel.create({
      name,
      department,
      departmenthead,
      image: imagePath, // store image path in the database
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve images statically
app.use('/uploads', express.static('uploads'));

app.get('/DoctorGet',async(req,res)=>{
  try{
      const users=await UserModel.find();
      res.json(users);
  }catch(error){
res.status(500).json({error:error.message});
  }
})
app.get('/data/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});
app.put('/user/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, departmenthead } = req.body;

    // Find the existing user in the database
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine the image path to use
    const imagePath = req.file ? req.file.path : existingUser.image;

    // Delete the old image file if a new image is uploaded
    if (req.file && existingUser.image) {
      const oldImagePath = path.join(__dirname, existingUser.image); // Construct the full old image path
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(`Error deleting old image file: ${oldImagePath}`, err);
        } else {
          console.log(`Successfully deleted old image file: ${oldImagePath}`);
        }
      });
    }

    // Update the user in the database with new data
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        name,
        department,
        departmenthead,
        image: imagePath // Use the new or existing image path
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const deleteImageFile = (filePath) => {
  if (filePath) {
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error(`Error deleting file: ${filePath}`, err);
          } else {
              console.log(`Successfully deleted file: ${filePath}`);
          }
      });
  }
};


app.delete('/Formdelete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // If user not found, return 404
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user has an associated image, delete the image file
    if (deletedUser.image) {
      const imagePath = path.join(__dirname, deletedUser.image); // Construct the full image path
      deleteImageFile(imagePath); // Call helper to delete image file
    }

    // Return success response
    res.status(200).json({ message: 'User and image deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});







  //DEPARTMENT HEAD SECTION

 // Assuming this is where your model is

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'headimg/'); // folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ensure unique file names
  }
});

const upload2 = multer({ storage: storage2 });

app.use('/headimg', express.static('headimg'));

app.post('/HeadFormPost', upload2.single('image'), async (req, res) => {
  try {
    const { name, department, phone, email } = req.body;
    const imagePath = req.file.path; // Path to the stored image

    // Create new doctor record with image path
    const newUser1 = await DoctorHeads.create({
      name,
      department,
      phone,
      email,
      image: imagePath
    });
    
    

    res.status(201).json(newUser1);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/DoctorHeadGet',async(req,res)=>{
  try{
      const users=await DoctorHeads.find();
      res.json(users);
  }catch(error){
res.status(500).json({error:error.message});
  }
})

app.get('/headform/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const user = await DoctorHeads.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});
app.put('/dhead/:id', upload2.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, phone, email } = req.body;

    // Find the existing Doctor Head in the database
    const existingDoctorHead = await DoctorHeads.findById(id);
    if (!existingDoctorHead) {
      return res.status(404).json({ message: 'Doctor Head not found' });
    }

    // Determine the image path to use
    const imagePath = req.file ? req.file.path : existingDoctorHead.image;

    // Delete the old image file if a new image is uploaded
    if (req.file && existingDoctorHead.image) {
      const oldImagePath = path.join(__dirname, existingDoctorHead.image); // Construct the full old image path
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(`Error deleting old image file: ${oldImagePath}`, err);
        } else {
          console.log(`Successfully deleted old image file: ${oldImagePath}`);
        }
      });
    }

    // Update the Doctor Head in the database
    const updatedDoctorHead = await DoctorHeads.findByIdAndUpdate(
      id,
      {
        name,
        department,
        phone,
        email,
        image: imagePath // Use the new or existing image path
      },
      { new: true }
    );

    res.status(200).json(updatedDoctorHead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/HeadFormdelete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const deletedUser = await DoctorHeads.findByIdAndDelete(id);

    // If user not found, return 404
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user has an associated image, delete the image file
    if (deletedUser.image) {
      const imagePath = path.join(__dirname, deletedUser.image); // Construct the full image path
      deleteImageFile(imagePath); // Call helper to delete image file
    }

    // Return success response
    res.status(200).json({ message: 'User and image deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});





 //DEPARTMENT SECTION
 


 const storage3 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Departimg/'); // folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ensure unique file names
  }
});

const upload3 = multer({ storage: storage3 });

app.use('/Departimg', express.static('Departimg'));

app.post('/DepartmentFormPost', upload3.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file.path; // Path to the stored image

    // Create new doctor record with image path
    const newUser1 = await DepartmentModel.create({
      name,
      description,
      image: imagePath
    });
    
    

    res.status(201).json(newUser1);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/DepartmentGet',async(req,res)=>{
  try{
      const users=await DepartmentModel.find();
      res.json(users);
  }catch(error){
res.status(500).json({error:error.message});
  }
})

app.get('/Departmentform/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const user = await DepartmentModel.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});
app.put('/departupdate/:id', upload3.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find the existing Department in the database
    const existingDepartment = await DepartmentModel.findById(id);
    if (!existingDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Determine the new image path
    const imagePath = req.file ? req.file.path : existingDepartment.image;

    // Delete the old image file if a new image is uploaded
    if (req.file && existingDepartment.image) {
      const oldImagePath = path.join(__dirname, existingDepartment.image); // Construct the full old image path
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(`Error deleting old image file: ${oldImagePath}`, err);
        } else {
          console.log(`Successfully deleted old image file: ${oldImagePath}`);
        }
      });
    }

    // Update the Department in the database with new data
    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        image: imagePath // Use the new or existing image path
      },
      { new: true }
    );

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/DepartmentFormdelete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the department by ID
    const deletedDepartment = await DepartmentModel.findByIdAndDelete(id);

    // If department not found, return 404
    if (!deletedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // If the department has an associated image, delete the image file
    if (deletedDepartment.image) {
      const imagePath = path.join(__dirname, deletedDepartment.image); // Construct the full image path
      deleteImageFile(imagePath); // Call helper to delete image file
    }

    // Return success response
    res.status(200).json({ message: 'Department and image deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
  //EMPLOYEES SECTION
  app.post('/EmployeeFormPost', async (req, res) => {
    try {
      console.log(req.body); // Log the received data
      
      const { name, dob, appointmentDate, joiningDate } = req.body;
      
      // Validate that all required fields are present
      if (!name || !dob || !appointmentDate || !joiningDate) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create new employee object
      const newEmployee = new EmployeeModel({
        name,
        dob,
        appointmentDate,
        joiningDate
      });
  
      // Save employee to the database
      await newEmployee.save();
  
      res.status(200).json({ message: 'Employee saved successfully!' });
    } catch (error) {
      console.error('Error saving employee:', error);
      res.status(500).json({ error: 'Failed to save employee data' });
    }
  });
  
  app.get('/employees', async (req, res) => {
    try {
      const employees = await EmployeeModel.find(); // Fetch all employees from DB
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch employee data' });
    }
  });
 
  app.delete('/employees/:id', async (req, res) => {
    try {
      const employeeId = req.params.id;
      const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);
  
      if (!deletedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  });


  app.put('/employees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      res.status(200).json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update employee' });
    }
  });
  
  mongoose
  .connect("mongodb://localhost:27017/hospital", {
    
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
