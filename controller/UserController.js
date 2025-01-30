const User = require('../Models/User'); // Ensure this is correct
const Admin = require('../Models/Admin');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.register = async function (req, res) {
  try {
    // Creat    e the new user
    const user = await User.create(req.body);

    const token = jwt.sign(
      { id: user._id, email: user.email, isUser: true }, // Add isAdmin here
      'IAmUser',
      {
        expiresIn: '1h',
      }
    );
    const userid1 = user.userid;
    return res.status(200).json({
      success: true,
      token,
      userid1,
      message: 'User registered successfully with initial tasks.',
      user: user,
    });
  } catch (err) {
    console.error('Registration error:', err);

    return res.status(500).json({
      success: false,
      message: 'Registration failed. ' + err.message,
    });
  }
};

// Login function
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'No userid or password provided',
      });
    }

    // Find the user by userid
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid Username or Password!',
      });
    }

    // Compare entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid Username or Password!',
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, isUser: true }, // Add isAdmin here
      'IAmUser',
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({
      success: true,
      token,
      email,
      msg: `Login Successful! Keep the Token safely, ${user.userid}!`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: 'Error Occurred!',
    });
  }
};
module.exports.adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide both email and password',
      });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid email or password',
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid email or password',
      });
    }

    // Generate a JWT token and include isAdmin in the token payload
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true }, // Add isAdmin here
      'IAmAdmin',
      {
        expiresIn: '1h',
      }
    );

    // Return a successful response with the token
    return res.status(200).json({
      success: true,
      token,
      msg: 'Login successful!',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred during login',
    });
  }
};

module.exports.verifytoken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false });
  }

  jwt.verify(token, 'IAmUser', (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false });
    }

    // Optionally, check if the user still exists or any additional validation
    return res.status(200).json({ valid: true });
  });
};

module.exports.verifytokenadmin = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false });
  }

  jwt.verify(token, 'IAmAdmin', (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false });
    }

    // Optionally, check if the user still exists or any additional validation
    return res.status(200).json({ valid: true });
  });
};
