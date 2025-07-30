# Hulet Fish Tourism Platform - Backend API

A scalable Node.js backend for the Hulet Fish community-based tourism platform, built with Express.js and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Tourist, Host, Guide, and Admin roles
- **Tour Management**: CRUD operations for tourism experiences
- **Booking System**: Complete booking workflow with status tracking
- **Review System**: Rating and review functionality
- **File Upload**: Image upload with Cloudinary integration
- **Payment Integration**: Stripe payment processing
- **Email Notifications**: Automated email system
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM

## 📁 Project Structure

\`\`\`
backend/
├── models/           # Database models (User, Tour, Booking, Review)
├── routes/           # API route handlers
├── middleware/       # Custom middleware (auth, error handling)
├── scripts/          # Database seeding and utility scripts
├── uploads/          # File upload directory
├── .env.example      # Environment variables template
├── server.js         # Main application entry point
└── package.json      # Dependencies and scripts
\`\`\`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone and Install
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Setup
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/huletfish
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
\`\`\`

### 3. Database Setup
\`\`\`bash
# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
npm run seed
\`\`\`

### 4. Start the Server
\`\`\`bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
\`\`\`

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Tours
- `GET /api/tours` - Get all tours (with filtering)
- `GET /api/tours/featured` - Get featured tours
- `GET /api/tours/:id` - Get single tour
- `POST /api/tours` - Create new tour (Host/Admin)
- `PUT /api/tours/:id` - Update tour (Host/Admin)
- `DELETE /api/tours/:id` - Delete tour (Host/Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/hosts` - Get all hosts

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/tour/:tourId` - Get tour reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## 👥 User Roles

- **Tourist**: Can browse and book tours, leave reviews
- **Host**: Can create and manage tours, handle bookings
- **Guide**: Can assist with tours and bookings
- **Admin**: Full system access and management

## 🗄️ Database Models

### User Model
- Personal information and authentication
- Role-based permissions
- Host profile for tour providers
- Location and language preferences

### Tour Model
- Tour details and pricing
- Location and availability
- Images and amenities
- Rating and review aggregation

### Booking Model
- Booking details and guest information
- Payment and status tracking
- Communication between host and tourist

### Review Model
- Rating system with multiple criteria
- Review content and photos
- Host response capability

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Adding New Features
1. Create model in `/models` if needed
2. Add routes in `/routes`
3. Implement middleware in `/middleware` if needed
4. Update API documentation

## 🚀 Deployment

### Environment Variables for Production
\`\`\`env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/huletfish
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
\`\`\`

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: App Platform or Droplets
- **AWS**: EC2 or Elastic Beanstalk
- **Vercel**: Serverless functions

## 📊 Sample Data

The seeding script creates:
- Admin user: `admin@huletfish.com` / `admin123`
- Sample hosts with approved profiles
- Featured tours with authentic Ethiopian experiences
- Sample bookings and reviews

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Request data validation
- **Password Hashing**: bcrypt encryption
- **JWT Authentication**: Secure token-based auth

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: support@huletfish.com
- Documentation: [API Docs](https://api.huletfish.com/docs)
- Issues: [GitHub Issues](https://github.com/huletfish/backend/issues)

## 📄 License

This project is licensed under the MIT License.
