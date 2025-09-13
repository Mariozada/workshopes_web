# Workshop Booking System

A comprehensive full-stack web application for managing workshop bookings, built with modern technologies and designed for scalability, security, and user experience.

## 🌟 Features

### 👥 User Management
- **User Registration & Authentication**: Secure account creation with email verification
- **Role-Based Access Control**: Separate interfaces for regular users and administrators
- **Profile Management**: Users can update personal information and view booking history
- **JWT-Based Authentication**: Secure, stateless authentication system

### 📅 Workshop Management
- **Workshop Listings**: Browse workshops with filtering by category, date, and search terms
- **Detailed Workshop Pages**: Complete information including instructor, schedule, location, and pricing
- **Category Organization**: Workshops organized by categories for easy discovery
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📝 Booking System
- **Real-Time Booking**: Instant seat reservation with capacity management
- **Booking Validation**: Prevents overbooking and ensures data integrity
- **User Booking History**: Complete history of past and upcoming workshops
- **Cancellation Management**: Users can cancel bookings within policy guidelines

### 📊 Admin Dashboard
- **Dashboard Overview**: Key metrics and statistics at a glance
- **Workshop Management**: Create, edit, and manage workshops
- **Booking Oversight**: View and manage all user bookings
- **Analytics & Reporting**: Detailed insights into workshop performance and user engagement

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js - Robust and scalable server framework
- **MySQL** - Reliable relational database for data persistence
- **JWT** - Secure authentication and authorization
- **bcryptjs** - Password hashing and security
- **express-validator** - Input validation and sanitization
- **helmet** - Security middleware for Express
- **cors** - Cross-origin resource sharing
- **rate-limiting** - API rate limiting for security

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Query** - Server state management and caching
- **React Hook Form** - Efficient form handling
- **Axios** - HTTP client for API communication
- **React Toastify** - User-friendly notifications
- **Lucide React** - Modern icon library

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd booking_web
   ```

2. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE workshop_booking;
   
   # Import the schema
   mysql -u root -p workshop_booking < database/schema.sql
   ```

3. **Configure the backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

4. **Configure the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

### Environment Configuration

#### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=workshop_booking
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (optional .env)
```env
VITE_API_URL=http://localhost:5000/api
```


## 🎯 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Workshops
- `GET /api/workshops` - Get all workshops (with filtering)
- `GET /api/workshops/:id` - Get workshop details
- `POST /api/workshops` - Create workshop (admin only)
- `PUT /api/workshops/:id` - Update workshop (admin only)
- `DELETE /api/workshops/:id` - Delete workshop (admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/all` - Get all bookings (admin only)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/workshops/analytics` - Workshop analytics
- `GET /api/admin/users/analytics` - User analytics
- `GET /api/admin/financial` - Financial reports

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin setup
- **Helmet Security**: Express security middleware
- **Role-Based Access**: Admin and user role separation

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: User-friendly error messages and fallbacks
- **Notifications**: Toast notifications for user feedback
- **Search & Filtering**: Advanced workshop discovery features
- **Pagination**: Efficient data loading with pagination
- **Accessibility**: WCAG-compliant interface elements

## 🚀 Deployment

### Backend Deployment
1. Set up a MySQL database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)
4. Set `NODE_ENV=production`

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to a static hosting service (Netlify, Vercel, AWS S3, etc.)
3. Configure the API URL in production

### Database Setup for Production
```sql
-- Run the schema file in your production database
mysql -u username -p production_database < database/schema.sql

-- Create an admin user (update the hashed password)
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@yourdomain.com', '$2a$12$hashedpassword', 'Admin', 'User', 'admin');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error messages, screenshots, and steps to reproduce

## 🔮 Future Enhancements

- Email notifications for bookings
- Calendar integration
- Payment processing
- Workshop reviews and ratings
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Workshop categories and tags
- Instructor profiles and management

---

Built with ❤️ using modern web technologies for a seamless workshop booking experience.
