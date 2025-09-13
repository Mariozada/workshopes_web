<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Workshop Booking System Instructions

This is a full-stack Workshop/Event Booking Web Application built with:

## Backend Technology Stack
- **Node.js** with Express.js framework
- **MySQL** database for data persistence
- **JWT** for authentication and authorization
- **bcryptjs** for password hashing
- **Validation** using express-validator
- **Security** with helmet and rate limiting

## Frontend Technology Stack
- **React 18** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router DOM** for routing
- **React Query** for server state management
- **React Hook Form** for form handling
- **Axios** for API communication
- **React Toastify** for notifications

## Key Features
- User registration and authentication with role-based access control
- Workshop browsing with search and filtering capabilities
- Booking system with capacity management
- User profile management
- Admin dashboard with analytics
- Responsive design for mobile and desktop

## Project Structure
- `/backend` - Express.js API server
- `/frontend` - React application
- `/database` - MySQL schema and setup scripts

## Code Conventions
- Use functional components with React hooks
- Follow RESTful API conventions
- Use consistent error handling patterns
- Implement proper validation on both client and server
- Use TypeScript-style JSDoc comments for better IntelliSense
- Follow responsive-first design approach with Tailwind CSS

## Security Considerations
- All API endpoints require proper authentication/authorization
- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Rate limiting for API endpoints

## Development Guidelines
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper loading and error states
- Follow accessibility best practices
- Write clean, readable, and maintainable code
