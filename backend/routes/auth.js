const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")
const emailService = require("../utils/emailService")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [tourist, host]
 *                 example: "tourist"
 *               phone:
 *                 type: string
 *                 example: "+251911234567"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully. Please check your email to verify your account."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["tourist", "host"]).withMessage("Role must be either tourist or host"),
    body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { name, email, password, role, phone } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        })
      }

      // Hash password
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString("hex")
      const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        profile: { phone },
        emailVerificationToken,
        emailVerificationExpires,
      })

      await user.save()

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      })

      // Send verification email
      try {
        await emailService.sendVerificationEmail(user.email, user.name, emailVerificationToken)
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        // Don't fail registration if email fails
      }

      // Remove password from response
      const userResponse = user.toObject()
      delete userResponse.password
      delete userResponse.emailVerificationToken

      res.status(201).json({
        success: true,
        message: "User registered successfully. Please check your email to verify your account.",
        data: {
          user: userResponse,
          token,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      })
    }
  },
)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Email not verified
 */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { email, password } = req.body

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email before logging in",
          requiresVerification: true,
        })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      })

      // Remove password from response
      const userResponse = user.toObject()
      delete userResponse.password

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: userResponse,
          token,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        success: false,
        message: "Server error during login",
      })
    }
  },
)

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abc123def456..."
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      })
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during email verification",
    })
  }
})

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Email already verified or user not found
 */
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      })
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    user.emailVerificationToken = emailVerificationToken
    user.emailVerificationExpires = emailVerificationExpires
    await user.save()

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, emailVerificationToken)

    res.json({
      success: true,
      message: "Verification email sent successfully",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while sending verification email",
    })
  }
})

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    })
  }
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (client-side token removal)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", auth, async (req, res) => {
  res.json({
    success: true,
    message: "Logout successful. Please remove the token from client storage.",
  })
})

module.exports = router
