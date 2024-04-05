require('dotenv').config(); // Load environment variables from .env file
// userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming you have a User model defined with Sequelize
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
  console.log(process.env.EMAIL) // Your Gmail address
  console.log(process.env.EMAIL_PASSWORD) // Your Gmail address
  try {
    const { email, phoneNum, name } = req.body;

    // Generate a random password
    const randomPassword = Math.random().toString(36).slice(-8); // Generate an 8-character random alphanumeric string

    // Hash the generated password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create the user
    const user = await User.create({ email, phoneNum, name, password: hashedPassword, role: 'user', active : false });

    // Send the random password to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD // Your Gmail password or application-specific password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL, 
      to: email, 
      subject: 'Your Randomly Generated Password',
      text: `Hello ${name},\n\nYour randomly generated password is: ${randomPassword}\n\nPlease keep this password secure. You can use it to log in to our system.\n\nRegards,\nThe Admin`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Omit the password field from the response
    if (user.password) delete user.password;
    res.status(201).json({ message: 'User registered successfully.', code: 201, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.', code: 500 });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.', code: 404 });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password.', code: 401 });
    }

    // Create and send JWT token
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful.', code: 200, data: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.', code: 500 });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: 'Users fetched successfully.', code: 200, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.', code: 500 });
  }
};

exports.changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { active } = req.body;

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.', code: 404 });
    }

    // Update the user's status
    active = 'true' ? true : false

    user.active = active;
    await user.save();

    res.status(200).json({ message: 'User status updated successfully.', code: 200, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.', code: 500 });
  }
};
