import bcryptjs from "bcryptjs";
import { User } from "../models/User.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { sanitizeUser } from "../helpers/sanitizeUser.js";
import { generateTokenAndSetCookie } from "../helpers/generateTokenAndSetCookie.js";

/**
 * Handles user signup by validating input, checking for existing users,
 * hashing the password with a generated salt, saving the new user to the database,
 * and returning a sanitized user object in the response.
 *
 * Expected Request Body:
 * {
 *   name: string,
 *   email: string,
 *   password: string
 * }
 *
 * Responses:
 * - 201: User created successfully
 * - 400: Missing fields, user already exists, or other error
 *
 * Dependencies:
 * - User model (MongoDB)
 * - bcryptjs for password hashing
 * - responseHandler for standardized API responses
 * - sanitizeUser to remove sensitive fields before returning user data
 */
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate that all required fields are provided
    if (!username || !email || !password) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "All fields are required"
      });
    }

    // Check if a user with the same email already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "User already exists",
      });
    }

    // Generate a salt and hash the password with it
    const salt = await bcryptjs.genSalt(12); // Use a strong salt round for security
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    if (savedUser) {
      // Generate a JWT token and set it as a cookie in the response
      generateTokenAndSetCookie(res, savedUser._id);

      return responseHandler(res, {
        status: 201,
        success: true,
        message: "User created successfully",
        data: sanitizeUser(savedUser), // Remove sensitive fields before sending user object
      });
    }

    // Fallback if saving failed without throwing
    return responseHandler(res, {
      status: 500,
      success: false,
      message: "Failed to save user",
    });
  } catch (error) {
    return responseHandler(res, {
      status: 400,
      success: false,
      message: "An error occurred while creating your account",
      error: error.message,
    });
  }
}

/**
 * Handles user login by validating input, checking for existing users by email,
 * comparing for password, generate token and set cookie, update last login
 * and returning a sanitized user object in the response.
 *
 * Expected Request Body:
 * {
 *   email: string,
 *   password: string
 * }
 *
 * Responses:
 * - 201: User logged in successfully
 * - 400: Missing fields, invalid credentials, or other error
 *
 * Dependencies:
 * - User model (MongoDB)
 * - bcryptjs for password hashing
 * - responseHandler for standardized API responses
 * - sanitizeUser to remove sensitive fields before returning user data
 */
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
    if (!user) {
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

    // Update last login property
    user.lastLogin = new Date();
    await user.save();

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

/**
 * Handles user logout by clearing cookie
 *
 * Responses:
 * - 201: User logged out successfully
 *
 * Dependencies:
 * - responseHandler for standardized API responses
 */
export const logout = async (req, res) => {
  // Clear cookie
  res.clearCookie("token");

  return responseHandler(res, {
    status: 200,
    success: true,
    message: "Logged out successfully",
  });
};