const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user still exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated",
      })
    }

    // Add user info to request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    })
  }
}

module.exports = auth
