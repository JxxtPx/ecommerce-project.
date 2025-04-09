import mongoose from "mongoose";
import User from "../models/User.js";
import Order from "../models/Order.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      res.status(404).json({ message: "no user found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Order.deleteMany({ user: user._id });

  
    await user.deleteOne();

    res.json({ message: "User and related orders deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error); // LOG FULL ERROR
    res.status(500).json({ message: error.message });
  }
};

export { deleteUser, getAllUsers };
