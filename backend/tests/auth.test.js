const request = require("supertest")
const app = require("../server")
const User = require("../models/User")

describe("Authentication Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "tourist",
        phone: "+251911234567",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.name).toBe(userData.name)
      expect(response.body.data.user.role).toBe(userData.role)
      expect(response.body.data.token).toBeDefined()
      expect(response.body.data.user.password).toBeUndefined()
    })

    it("should not register user with invalid email", async () => {
      const userData = {
        name: "John Doe",
        email: "invalid-email",
        password: "password123",
        role: "tourist",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })

    it("should not register user with short password", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "123",
        role: "tourist",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })

    it("should not register user with duplicate email", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "tourist",
      }

      // Register first user
      await request(app).post("/api/auth/register").send(userData).expect(201)

      // Try to register with same email
      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("already exists")
    })
  })

  describe("POST /api/auth/login", () => {
    let user
    let userData

    beforeEach(async () => {
      userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "tourist",
      }

      // Register and verify user
      const registerResponse = await request(app).post("/api/auth/register").send(userData)

      user = await User.findById(registerResponse.body.data.user._id)
      user.isEmailVerified = true
      await user.save()
    })

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.token).toBeDefined()
      expect(response.body.data.user.password).toBeUndefined()
    })

    it("should not login with invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "wrong@example.com",
          password: userData.password,
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("Invalid email or password")
    })

    it("should not login with invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "wrongpassword",
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("Invalid email or password")
    })

    it("should not login with unverified email", async () => {
      // Create unverified user
      const unverifiedUser = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        role: "tourist",
      }

      await request(app).post("/api/auth/register").send(unverifiedUser)

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: unverifiedUser.email,
          password: unverifiedUser.password,
        })
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("verify your email")
      expect(response.body.requiresVerification).toBe(true)
    })
  })

  describe("GET /api/auth/me", () => {
    let token
    let user

    beforeEach(async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "tourist",
      }

      const registerResponse = await request(app).post("/api/auth/register").send(userData)

      token = registerResponse.body.data.token
      user = await User.findById(registerResponse.body.data.user._id)
      user.isEmailVerified = true
      await user.save()
    })

    it("should get user profile with valid token", async () => {
      const response = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.email).toBe("john@example.com")
      expect(response.body.data.password).toBeUndefined()
    })

    it("should not get profile without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401)

      expect(response.body.success).toBe(false)
    })

    it("should not get profile with invalid token", async () => {
      const response = await request(app).get("/api/auth/me").set("Authorization", "Bearer invalidtoken").expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/verify-email", () => {
    let user
    let verificationToken

    beforeEach(async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "tourist",
      }

      const registerResponse = await request(app).post("/api/auth/register").send(userData)

      user = await User.findById(registerResponse.body.data.user._id)
      verificationToken = user.emailVerificationToken
    })

    it("should verify email with valid token", async () => {
      const response = await request(app).post("/api/auth/verify-email").send({ token: verificationToken }).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain("verified successfully")

      // Check that user is now verified
      const updatedUser = await User.findById(user._id)
      expect(updatedUser.isEmailVerified).toBe(true)
      expect(updatedUser.emailVerificationToken).toBeUndefined()
    })

    it("should not verify email with invalid token", async () => {
      const response = await request(app).post("/api/auth/verify-email").send({ token: "invalidtoken" }).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("Invalid or expired")
    })

    it("should not verify email without token", async () => {
      const response = await request(app).post("/api/auth/verify-email").send({}).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("required")
    })
  })
})
