import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

/**
 * @desc Get the currently logged-in user's data
 * @route GET /api/user/current
 * @access Private (requires auth middleware to set req.userId)
 */
export const getCurrentUser = async (req, res) => {
  try {

    console.log("Inside getCurrentUser");
    console.log("req.userId:", req.userId); // ⬅️ ADD THIS
    const userId = req.userId;
    console.log("Fetching current user with ID:", userId);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return res.status(500).json({ message: `Current user error: ${error.message}` });
  }
};

/**
 * @desc Edit user's profile (name and optional image)
 * @route PUT /api/user/edit-profile
 * @access Private
 */
export const editProfile = async (req, res) => {

    

  try {
    
    const { name } = req.body;
    let image;

    
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        ...(image && { image }),
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("EditProfile Error:", error);
    return res.status(500).json({ message: `Profile error: ${error.message}` });
  }
};

/**
 * @desc Get all users except the current user
 * @route GET /api/user/others
 * @access Private
 */
export const getOtherUser = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.error("GetOtherUser Error:", error);
    return res.status(500).json({ message: `Get other user error: ${error.message}` });
  }
};
