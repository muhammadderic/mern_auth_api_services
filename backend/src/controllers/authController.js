import bcryptjs from "bcryptjs";
import { responseHandler } from "../helpers/responseHandler.js";
import { sanitizeUser } from "../helpers/sanitizeUser.js";
import { generateTokenAndSetCookie } from "../helpers/generateTokenAndSetCookie.js";
import { User } from "../models/User.js";

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

    // Create and save a new user with hashed password
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