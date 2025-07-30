# Project Title: Hulet Fish Tourism Platform

A modern, scalable, and community-driven platform for booking and managing authentic Ethiopian  tourism experiences. This monorepo includes both the frontend (Next.js) and backend (Node.js/Express) applications, and is designed to deliver a seamless experience for tourists, hosts, guides, and administrators.
## Contributors:
- Yared Atrsaw Andargei
- Befekadu Berhanu Burju

## Project Synopsis

### Problem Statement:
Ethiopia, with its rich cultural diversity and over 80 ethnic groups, offers unique local experiences that remain largely untapped by tourists. The tourism sector still relies on a few traditional sites and lacks a centralized, secure, and tech-enabled platform. As a result, authentic cultural experiences are missed, and local hosts lack visibility.


### Planned Solution:
We’re building a full-stack tourism platform that connects tourists with verified local hosts offering authentic Ethiopian experiences. Using Fayda ID, we ensure secure, trusted bookings—bringing the true spirit of Ethiopia directly to every traveler.



### Expected Outcome:
A functioning MVP that includes:
- Fayda login system
- Tour management
- Booking and payment processing
- Admin dashboard
- Secure, scalable infrastructure

### Fayda's Role:
A few years ago, safely connecting a foreign tourist to a local Ethiopian home was nearly impossible. With Fayda Digital ID, we now verify all users—making secure, trusted cultural exchange possible.

This project may look like tourism, but at its core, it's a showcase of what Fayda makes possible.

### Tech Stack:
- Frontend: Next.js, Tailwind CSS, Vercel
- Backend: Node.js, Express.js, MongoDB, JWT, VeriFayda OIDC
- Payments: Stripe
- Media: Cloudinary
- Dev Tools: GitHub, Postman, dotenv, Helmet, CORS
# Hulet Fish Tourism Platform

## Table of Contents

- [Features](#features)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [User Roles](#user-roles)
- [Security](#security)
- [Development & Contribution](#development--contribution)
- [Deployment](#deployment)
- [Support](#support)
- [License](#license)

---

## Features

- Full-stack monorepo with shared codebase
- Next.js frontend with modern UI/UX
- Node.js/Express backend with RESTful API
- MongoDB with Mongoose ODM
- JWT-based authentication and robust role management
- Tour creation, management, and booking
- Stripe payment integration
- Cloudinary image uploads
- Reviews and rating system
- Automated email notifications
- Security best practices (Helmet, CORS, rate limiting)
- Comprehensive API documentation

---

## Monorepo Structure

app/         # Next.js frontend application
backend/     # Node.js/Express backend API
components/  # Shared React components
hooks/       # Shared React hooks
lib/         # Shared libraries and utilities
public/      # Static assets
styles/      # Global styles

---

## Getting Started

### Frontend Setup

1. **Navigate to the project root**
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Run the development server**
   ```bash
   pnpm dev
   ```
   The frontend will start at `http://localhost:3000`.

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Copy and configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret, etc.
   ```
4. **Seed the database with sample data (optional)**
   ```bash
   npm run seed
   ```
5. **Run the development server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

## Project Structure

### Backend

backend/
├── models/           # Database models (User, Tour, Booking, Review)
├── routes/           # API route handlers
├── middleware/       # Custom middleware (auth, error handling)
├── scripts/          # Database seeding and utilities
├── uploads/          # File upload directory
├── .env.example      # Environment variables template
├── server.js         # Main application entry point
└── package.json      # Dependencies and scripts

---

## API Overview

- Authentication
  - POST /api/auth/register — Register a new user
  - POST /api/auth/login — Login
  - POST /api/auth/google — Google OAuth login
  - GET /api/auth/me — Current user profile
  - POST /api/auth/logout — Logout

- Tours
  - GET /api/tours — List all tours (with filtering)
  - GET /api/tours/featured — Featured tours
  - GET /api/tours/:id — Single tour
  - POST /api/tours — Create new tour (Host/Admin)
  - PUT /api/tours/:id — Update tour (Host/Admin)
  - DELETE /api/tours/:id — Delete tour (Host/Admin)

- Users
  - GET /api/users/profile — Get profile
  - PUT /api/users/profile — Update profile
  - GET /api/users/hosts — List hosts

- Bookings
  - POST /api/bookings — Create booking
  - GET /api/bookings — User bookings
  - GET /api/bookings/:id — Booking details
  - PUT /api/bookings/:id/status — Update status

- Reviews
  - POST /api/reviews — Create review
  - GET /api/reviews/tour/:tourId — Tour reviews
  - PUT /api/reviews/:id — Update review
  - DELETE /api/reviews/:id — Delete review
See the backend/README.md for full API documentation.

---

## User Roles

- Tourist: Browse/book tours, leave reviews
- Host: Create/manage tours, handle bookings
- Guide: Assist with tours and bookings
- Admin: Full system access and management

---

## Security

- Helmet: HTTP security headers
- CORS: Configurable cross-origin requests
- Rate Limiting: Protect API from abuse
- Input Validation: Sanitize and validate all input
- Password Hashing: bcrypt encryption
- JWT Authentication: Secure token-based auth

---

## Development & Contribution

1. Fork the repository
2. Create a feature branch
3. Implement your changes (with tests if applicable)
4. Submit a pull request

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Deployment

### Environment Variables

Copy .env.example files and configure for your environment (development or production).

### Supported Platforms

- Heroku: Recommended for quick deployments with MongoDB Atlas
- DigitalOcean: App Platform or Droplets
- AWS: EC2 or Elastic Beanstalk
- Vercel: For frontend/serverless functions

---

## Support

- Email: [t.zanafola@alustudent.com](mailto:t.zanafola@alustudent.com)
- API Documentation: [API Docs](https://api.huletfish.com/docs)
- Issues: [GitHub Issues](https://github.com/hulet-fish-tourism/issues)

---

## License

This project is licensed under the MIT License.
