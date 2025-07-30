const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hulet Fish Tourism API",
      version: "1.0.0",
      description: "Comprehensive API for Ethiopian fish tourism platform connecting tourists with local communities",
      contact: {
        name: "Hulet Fish Tourism",
        email: "api@huletfish.com",
        url: "https://huletfish.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL || "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://huletfish-api.onrender.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from login endpoint",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "Full name of the user",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address",
            },
            role: {
              type: "string",
              enum: ["tourist", "host", "admin"],
              description: "User role",
            },
            isEmailVerified: {
              type: "boolean",
              description: "Email verification status",
            },
            profile: {
              type: "object",
              properties: {
                avatar: { type: "string" },
                bio: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" },
                languages: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Tour: {
          type: "object",
          required: ["title", "description", "price", "duration", "location"],
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            duration: { type: "number" },
            location: {
              type: "object",
              properties: {
                name: { type: "string" },
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                },
              },
            },
            images: {
              type: "array",
              items: { type: "string" },
            },
            host: { type: "string" },
            maxGuests: { type: "number" },
            difficulty: {
              type: "string",
              enum: ["easy", "moderate", "challenging"],
            },
            category: {
              type: "string",
              enum: ["fishing", "cultural", "adventure", "relaxation"],
            },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Booking: {
          type: "object",
          required: ["tour", "tourist", "startDate", "guests"],
          properties: {
            _id: { type: "string" },
            tour: { type: "string" },
            tourist: { type: "string" },
            host: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            guests: { type: "number" },
            totalPrice: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "completed"],
            },
            paymentStatus: {
              type: "string",
              enum: ["pending", "paid", "refunded", "failed"],
            },
            specialRequests: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              description: "Success message",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
}

const specs = swaggerJsdoc(options)

module.exports = specs
