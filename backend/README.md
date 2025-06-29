# VIP Motors Backend API

A comprehensive REST API for the VIP Motors hypercar showcase application, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management, password reset
- **Hypercar Showcase**: CRUD operations for hypercar data with advanced filtering
- **Dashboard**: Personalized user dashboard with favorites and recommendations
- **Security**: Rate limiting, input validation, CORS, helmet security headers
- **Email Integration**: Email verification and password reset functionality

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Email**: nodemailer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/vip-motors
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=24h
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email address

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `DELETE /api/users/me` - Deactivate current user account
- `GET /api/users/favorites` - Get user's favorite hypercars

### Hypercars
- `GET /api/hypercars` - Get all hypercars (with filtering)
- `GET /api/hypercars/featured` - Get featured hypercars
- `GET /api/hypercars/:id` - Get single hypercar
- `POST /api/hypercars` - Create new hypercar (Admin)
- `PUT /api/hypercars/:id` - Update hypercar (Admin)
- `DELETE /api/hypercars/:id` - Delete hypercar (Admin)
- `POST /api/hypercars/:id/favorite` - Add to favorites
- `DELETE /api/hypercars/:id/favorite` - Remove from favorites

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/favorites` - Get user favorites
- `GET /api/dashboard/recommendations` - Get personalized recommendations
- `GET /api/dashboard/activity` - Get user activity
- `GET /api/dashboard/search` - Search hypercars
- `GET /api/dashboard/compare` - Compare hypercars

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User
- `firstName`, `lastName`, `email`, `phone`, `password`
- `role` (user/admin/moderator)
- `favorites` (array of Hypercar IDs)
- `isEmailVerified`, `emailVerificationToken`
- `passwordResetToken`, `loginAttempts`, `lockUntil`
- `preferences`, `profilePicture`, `isActive`

### Hypercar
- `brand`, `name`, `model`, `year`
- `price` (amount, currency, formatted)
- `emoji`, `images`
- `specs` (power, topSpeed, acceleration, engine, etc.)
- `description` (short, long)
- `features`, `production`, `status`, `location`, `tags`
- `isFeatured`, `isActive`, `views`, `favorites`

## 🚀 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **Password Security**: bcryptjs hashing with configurable rounds
- **JWT Security**: Secure token generation and validation
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection against common vulnerabilities
- **Account Lockout**: Automatic account locking after failed login attempts

## 📧 Email Integration

The API includes email functionality for:
- Email verification
- Password reset
- Welcome emails

Configure email settings in `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@vipmotors.com
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/vip-motors |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 24h |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |
| `JWT_REFRESH_EXPIRE` | JWT refresh expiration | 7d |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | 15 |
| `RATE_LIMIT_MAX` | Rate limit max requests | 100 |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:3000 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@vipmotors.com or create an issue in the repository.

---

**VIP Motors Backend API** - Powering the ultimate hypercar showcase experience. 