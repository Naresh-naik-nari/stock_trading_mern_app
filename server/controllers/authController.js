const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const errorMessage = (res, error) => {
  return res.status(400).json({ status: "fail", message: error.message });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return res.status(200).json({
        status: "fail",
        message: "Not all fields have been entered",
      });
    }

    if (password.length < 6 || password.length > 25) {
      return res.status(200).json({
        status: "fail",
        message: "Password must be between 6-25 characters",
        type: "password",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "An account with this username already exists.",
        type: "username",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(200).json({
        status: "fail",
        message: "An account with this email already exists.",
        type: "email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, email, role: role || 'user' });
    const savedUser = await newUser.save();
    return res.status(201).json({ status: "success", user: { username: savedUser.username, email: savedUser.email, role: savedUser.role, id: savedUser._id } });
  } catch (error) {
    console.error("Register Controller Error:", error);
    return errorMessage(res, error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log('Login attempt:', { username: req.body.username, hasPassword: !!req.body.password });
    
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing fields:', { username: !!username, password: !!password });
      return res.status(200).json({
        status: "fail",
        message: "Not all fields have been entered.",
      });
    }

    // Normalize username to lowercase to match how it's stored in DB
    const normalizedUsername = typeof username === 'string' ? username.toLowerCase() : username;
    console.log('Looking for user:', normalizedUsername);
    
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      console.log('User not found:', normalizedUsername);
      return res.status(200).json({
        status: "fail",
        message: "Invalid credentials. Please try again.",
      });
    }

    console.log('User found, checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', normalizedUsername);
      return res.status(200).json({
        status: "fail",
        message: "Invalid credentials. Please try again.",
      });
    }

    console.log('Password match, generating token...');
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set!');
      return res.status(500).json({
        status: "fail",
        message: "Server configuration error.",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    console.log('Login successful for user:', normalizedUsername);
    
    return res.status(200).json({
      token,
      user: {
        username: user.username,
        id: user._id,
        balance: user.balance,
        role: user.role,
        email: user.email
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    return res.status(200).json({
      status: "fail",
      message: "Something went wrong. Please try again.",
    });
  }
};

exports.validate = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (error) {
    return res.json(false);
  }
};



