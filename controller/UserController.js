const User = require('../Models/User'); // Ensure this is correct
const Admin = require('../Models/Admin');
const sendEmail = require('../Mailer/sandEmail');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.register = async function (req, res) {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Find the user who referred the new user using the referral code
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode });
      if (!referredByUser) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code.',
        });
      }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique referral code for the new user
    const newReferralCode = crypto.randomBytes(6).toString('hex');

    // Create a new user instance
    const user = new User({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredByUser ? referredByUser.email : null, // Save the referrer’s email
    });

    // Save the new user to the database
    await user.save();

    // If there is a referrer, increment the referral count
    if (referredByUser) {
      referredByUser.referralCount += 1;
      await referredByUser.save(); // Save the updated referrer data
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, isUser: true },
      'IAmUser',
      { expiresIn: '168h' }
    );

    return res.status(200).json({
      success: true,
      token,
      message: 'User registered successfully with referral system.',
      user,
      referralCode: user.referralCode,
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
        expiresIn: '168h',
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
        expiresIn: '168h',
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

module.exports.addTotalAttendQuestion = async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Debugging
    const { email, totalattend, correct } = req.body;

    if (
      !email ||
      isNaN(totalattend) ||
      isNaN(correct) ||
      totalattend < 0 ||
      correct < 0
    ) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.totalAttendedQuestions =
      (user.totalAttendedQuestions || 0) + Number(totalattend);
    user.correctAnswers = (user.correctAnswers || 0) + Number(correct);

    await user.save();

    res.status(200).json({
      message: 'User quiz statistics updated successfully!',
      totalAttendedQuestions: user.totalAttendedQuestions,
      correctAnswers: user.correctAnswers,
    });
  } catch (error) {
    console.error('Error updating user quiz statistics:', error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
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
    const email = decoded.email;

    // Optionally, check if the user still exists or any additional validation
    return res.status(200).json({ valid: true, email: email });
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
module.exports.viewUserProfile = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from request body

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        msg: 'Email is required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    // Send user profile data (username, totalAttendedQuestions, correctAnswers)
    return res.status(200).json({
      success: true,
      profile: {
        username: user.name,
        totalAttendedQuestions: user.totalAttendedQuestions,
        correctAnswers: user.correctAnswers,
        referralCode: user.referralCode,
        referralCount: user.referralCount,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      msg: 'Internal Server Error',
    });
  }
};
const otpStore = {}; // Store OTPs temporarily

module.exports.Forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in memory (valid for 5 minutes)
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    console.log(`Generated OTP for ${email}: ${otp}`); // Debugging purpose

    // Send OTP via email
    await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error in Forgetpassword:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Verify OTP
module.exports.VarifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  if (!storedOtp || storedOtp.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // OTP verified, allow password reset
  delete otpStore[email];
  const token = jwt.sign({ email }, 'yourSecretKey', { expiresIn: '10m' });
  res.json({ message: 'OTP verified', token });
};

// Reset Password
module.exports.ResetOtp = async (req, res) => {
  const { email, newPassword, token } = req.body;
  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    if (decoded.email !== email)
      return res.status(400).json({ error: 'Invalid token' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.updateOne({ email }, { password: hashedPassword });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

// POST /user/deductreferrals
exports.Deductreferrals = async (req, res) => {
  const { email, deductCount } = req.body;
  console.log('Deducting referrals:', email, deductCount);

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.referralCount < deductCount) {
      return res
        .status(400)
        .json({ message: 'Not enough referralCount to deduct' });
    }

    // Deduct referralCount
    user.referralCount -= deductCount;
    await user.save();

    res.status(200).json({
      message: 'referralCount deducted successfully',
      referralCount: user.referralCount,
    });
  } catch (error) {
    console.error('Error deducting referrals:', error);
    res.status(500).json({ message: 'Failed to deduct referrals' });
  }
};
