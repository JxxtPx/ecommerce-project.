import User from "../models/User.js";

// Update profile image
export const updateUserProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image file provided" });
    }

    user.profileImage = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

// Optional: Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
