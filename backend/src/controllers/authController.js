import bcryptjs from "bcryptjs";
import { User } from "../models/User.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { sanitizeUser } from "../helpers/sanitizeUser.js";
import { generateTokenAndSetCookie } from "../helpers/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../resend/emails.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "All fields are required"
      });
    }

    // Check if a user with the given email already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate a 6-digit verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new User instance
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save();

    // Generate a JWT token and set it as a cookie in the response
    generateTokenAndSetCookie(res, user._id);

    // Send the verification token to the user's email
    await sendVerificationEmail(user.email, verificationToken);

    return responseHandler(res, {
      status: 201,
      success: true,
      message: "User created successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return responseHandler(res, {
      status: 400,
      success: false,
      message: "An error occurred while creating your account",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate that all required fields are provided
    if (!email || !password) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "All fields are required"
      });
    }

    // Check if the email valid
    const user = await User.findOne({ email });
    if (user) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if the password valid
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate a JWT token and set it as a cookie in the response
    generateTokenAndSetCookie(res, user._id);

    return responseHandler(res, {
      status: 200,
      success: true,
      message: "Logged in successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return responseHandler(res, {
      status: 400,
      success: false,
      message: "An error occurred while login process",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  // Clear cookie
  res.clearCookie("token");

  return responseHandler(res, {
    status: 200,
    success: true,
    message: "Logged out successfully",
  });
};