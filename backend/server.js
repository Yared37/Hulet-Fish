const express = require("express")
const http = require("http")
const connectDB = require("./config/db")
const path = require("path")
const cors = require("cors")
const { setupWebSocketServer } = require("./websocket/chat-handler")

// Load environment variables
require("dotenv").config()

// Initialize express
const app = express()

// Connect to Database
connectDB()

// Initialize middleware
app.use(express.json({ extended: false }))
app.use(cors())

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Define Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/tours", require("./routes/tours"))
app.use("/api/bookings", require("./routes/bookings"))
app.use("/api/hosts", require("./routes/hosts"))
app.use("/api/explore", require("./routes/explore"))
app.use("/api/payments", require("./routes/payments"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/chat", require("./routes/chat"))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Create HTTP server
const server = http.createServer(app)

// Setup WebSocket server for chat
setupWebSocketServer(server)

// Define PORT
const PORT = process.env.PORT || 5000

// Start server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
