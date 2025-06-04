import bcryptjs from "bcryptjs";
import { User } from "../models/User.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { sanitizeUser } from "../helpers/sanitizeUser.js";
import { generateTokenAndSetCookie } from "../helpers/generateTokenAndSetCookie.js";

import {
  sendVerificationEmail,
  sendWelcomeEmail
} from "../resend/emails.js";

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

    // Generate a 6-digit verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    const savedUser = await user.save();

    if (savedUser) {
      // Generate a JWT token and set it as a cookie in the response
      generateTokenAndSetCookie(res, savedUser._id);

      // Send the verification token to the user's email
      await sendVerificationEmail(savedUser.email, verificationToken);

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

/**
 * Verifies a user's email using a verification code and updates their verification status.
 *
 * Expected Request Body:
 * {
 *   verificationCode: string
 * }
 *
 * Responses:
 * - 200: Email verified successfully
 * - 400: Invalid or expired verification code
 * - 500: An error occurred during the verification process
 *
 * Dependencies:
 * - User (Mongoose model for user data)
 * - responseHandler (Standardized HTTP response wrapper)
 * - sendWelcomeEmail (Sends a welcome email after successful verification)
 * - sanitizeUser (Removes sensitive fields from user object before sending response)
 */
export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    // Look for a user with a matching, non-expired verification token
    const user = await User.findOne({
      verificationToken: verificationCode.verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    // If no matching user is found, return an error response
    if (!user) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Mark the user's email as verified and clear the token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Send a welcome email to the verified user
    await sendWelcomeEmail(user.email, user.name);

    return responseHandler(res, {
      status: 200,
      success: true,
      message: "Email verified successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return responseHandler(res, {
      status: 500,
      success: false,
      message: "An error occurred while verify email process",
      error: error.message,
    });
  }
};