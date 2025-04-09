import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// @desc Register a new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password,role } = req.body;


  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User exists" });
    }

    const user = await User.create({ name, email, password, role });
 

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        profileImage: user.profileImage || "", 
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        profileImage: user.profileImage || "", 
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile (Protected)
// @route GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json("user not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, getUserProfile };
