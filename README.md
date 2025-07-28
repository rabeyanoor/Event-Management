# Event Management System

A full-stack event management application built with React TypeScript frontend and Spring Boot backend.

## Features

- **User Authentication & Authorization** - JWT-based secure login and registration
- **Event Management** - Create, view, edit, and delete events
- **Calendar View** - Interactive calendar to visualize events
- **Dashboard** - Overview of user's events and activities
- **User Profiles** - Manage user information and preferences
- **Dark/Light Theme** - Toggle between themes with persistent preferences
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **React DatePicker** for date selection

### Backend
- **Spring Boot 3.2.5** with Java 21
- **Spring Security** for authentication
- **MongoDB** for data persistence
- **JWT** for token-based authentication
- **Lombok** for reducing boilerplate code

## Project Structure

### Overview
```
event-management-system/
├── frontend/                 # React TypeScript frontend application
├── backend/                  # Spring Boot backend application
└── README.md                 # Project documentation
```

### Frontend Structure (React TypeScript)

```
frontend/
├── public/                   # Static assets
│   ├── vite.svg             # Vite logo
│   └── index.html           # HTML template
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── Auth/           # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── Calendar/       # Calendar view components
│   │   │   └── EventCalendar.tsx
│   │   ├── Dashboard/      # Dashboard components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AttendeeDashboard.tsx
│   │   │   └── OrganizerDashboard.tsx
│   │   ├── Events/         # Event management components
│   │   │   ├── EventList.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── CreateEvent.tsx
│   │   │   └── EditEvent.tsx
│   │   ├── Layout/         # Layout components
│   │   │   └── Header.tsx
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── Profile.tsx     # User profile component
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/           # React contexts for state management
│   │   ├── AuthContext.tsx # Authentication context
│   │   └── ThemeContext.tsx # Theme management context
│   ├── services/           # API service functions
│   │   ├── authService.ts  # Authentication API calls
│   │   ├── eventService.ts # Event management API calls
│   │   ├── userService.ts  # User profile API calls
│   │   ├── registrationService.ts # Event registration API calls
│   │   └── fetchWithAuth.ts # Authenticated HTTP client
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Global type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── .env                    # Environment variables
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── eslint.config.js        # ESLint configuration
```

### Backend Structure (Spring Boot)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/eventmanagement/
│   │   │   ├── config/     # Configuration classes
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── MongoConfig.java
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/ # REST API controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── EventController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── RegistrationController.java
│   │   │   │   └── DashboardController.java
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── JwtResponse.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── EventCreateRequest.java
│   │   │   │   ├── EventUpdateRequest.java
│   │   │   │   ├── EventResponse.java
│   │   │   │   ├── UserUpdateRequest.java
│   │   │   │   ├── UserProfileResponse.java
│   │   │   │   ├── RegistrationCreateRequest.java
│   │   │   │   ├── RegistrationResponse.java
│   │   │   │   ├── RegistrationUpdateRequest.java
│   │   │   │   └── ConfirmedRegistrationWithEventResponse.java
│   │   │   ├── exception/  # Exception handling
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── AuthException.java
│   │   │   ├── model/      # Entity models
│   │   │   │   ├── User.java
│   │   │   │   ├── Event.java
│   │   │   │   ├── Registration.java
│   │   │   │   ├── UserRole.java
│   │   │   │   ├── EventStatus.java
│   │   │   │   ├── EventCategory.java
│   │   │   │   ├── LocationType.java
│   │   │   │   └── RegistrationStatus.java
│   │   │   ├── repository/ # Data access layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── EventRepository.java
│   │   │   │   └── RegistrationRepository.java
│   │   │   ├── security/   # Security components
│   │   │   │   ├── JwtAuthenticationEntryPoint.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── UserPrincipal.java
│   │   │   │   └── EventSecurity.java
│   │   │   ├── service/    # Business logic interfaces
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── EventService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── RegistrationService.java
│   │   │   │   └── EmailService.java
│   │   │   ├── service/impl/ # Business logic implementations
│   │   │   │   ├── AuthServiceImpl.java
│   │   │   │   ├── EventServiceImpl.java
│   │   │   │   ├── UserServiceImpl.java
│   │   │   │   ├── RegistrationServiceImpl.java
│   │   │   │   └── EmailServiceImpl.java
│   │   │   └── EventManagementApplication.java # Main application class
│   │   └── resources/      # Configuration files
│   │       ├── application.properties # Application configuration
│   │       └── static/     # Static resources (if any)
│   └── test/
│       └── java/com/eventmanagement/ # Test classes
│           ├── controller/ # Controller tests
│           ├── service/    # Service tests
│           └── repository/ # Repository tests
├── target/                 # Maven build output
├── pom.xml                 # Maven dependencies and configuration
└── .gitignore             # Git ignore rules
```

### Key Architecture Components

#### Frontend Architecture
- **Components**: Modular React components with TypeScript
- **Contexts**: Global state management for authentication and theming
- **Services**: API communication layer with error handling
- **Types**: Centralized TypeScript type definitions
- **Routing**: Protected routes with role-based access control

#### Backend Architecture
- **Controllers**: RESTful API endpoints with proper HTTP status codes
- **Services**: Business logic layer with transaction management
- **Repositories**: Data access layer using Spring Data MongoDB
- **DTOs**: Request/response objects for API communication
- **Security**: JWT-based authentication with role-based authorization
- **Models**: MongoDB document entities with validation

#### Database Schema (MongoDB)
- **Users Collection**: User profiles, roles, and preferences
- **Events Collection**: Event details, location, and metadata
- **Registrations Collection**: User event registrations and status

#### Security Features
- JWT token-based authentication
- Role-based access control (ADMIN, ORGANIZER, ATTENDEE)
- Protected API endpoints with method-level security
- CORS configuration for cross-origin requests
- Input validation and sanitization

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/refresh      # Refresh JWT token
POST /api/auth/logout       # User logout
POST /api/auth/forgot-password # Password reset request
POST /api/auth/reset-password  # Password reset confirmation
```

### User Management Endpoints
```
GET  /api/users/profile     # Get current user profile
PUT  /api/users/profile     # Update user profile
GET  /api/users/{id}        # Get user by ID (Admin only)
DELETE /api/users/{id}      # Delete user (Admin only)
GET  /api/users             # List all users (Admin only)
```

### Event Management Endpoints
```
GET    /api/events          # List all published events
POST   /api/events          # Create new event (Organizer/Admin)
GET    /api/events/{id}     # Get event details
PUT    /api/events/{id}     # Update event (Owner/Organizer/Admin)
DELETE /api/events/{id}     # Delete event (Owner/Organizer/Admin)
GET    /api/events/search   # Search events
GET    /api/events/organizer/{id} # Get events by organizer
PUT    /api/events/{id}/status    # Update event status
GET    /api/events/categories     # Get event categories
```

### Registration Endpoints
```
POST   /api/registrations   # Register for event
PUT    /api/registrations/{id} # Update registration
DELETE /api/registrations/{id} # Cancel registration
GET    /api/registrations/user/{id}  # Get user registrations
GET    /api/registrations/event/{id} # Get event registrations
PUT    /api/registrations/{id}/attendance # Mark attendance
```

### Dashboard Endpoints
```
GET /api/dashboard/admin     # Admin dashboard data
GET /api/dashboard/organizer # Organizer dashboard data
GET /api/dashboard/attendee  # Attendee dashboard data
```

## Data Flow Architecture

### Frontend to Backend Communication
1. **Authentication Flow**:
   - User submits login credentials
   - Frontend sends POST request to `/api/auth/login`
   - Backend validates credentials and returns JWT token
   - Frontend stores token and updates AuthContext
   - Subsequent requests include JWT token in Authorization header

2. **Event Management Flow**:
   - User creates/edits event through form
   - Frontend validates input and sends API request
   - Backend processes request with business logic
   - Database is updated with transaction management
   - Response is sent back to frontend
   - UI is updated to reflect changes

3. **Real-time Updates**:
   - Dashboard auto-refreshes on navigation
   - Event lists refresh after CRUD operations
   - User profile updates reflect immediately in header

## Prerequisites

- **Node.js** (v18 or higher)
- **Java** (v21 or higher)
- **Maven** (v3.6 or higher)
- **MongoDB** (v4.4 or higher)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and build:
   ```bash
   mvn clean install
   ```

3. Configure MongoDB connection in `application.properties`

4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend URL (default: `http://localhost:8080/api`)

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `mvn spring-boot:run` - Start the application
- `mvn test` - Run tests
- `mvn clean install` - Clean and build the project

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend
Configure in `application.properties`:
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/eventmanagement

# JWT Configuration
spring.security.jwt.secret=your-secret-key
spring.security.jwt.expiration=86400000
spring.security.jwt.refresh-expiration=604800000


# Logging
logging.level.com.eventmanagement=DEBUG
```

## Development Workflow

### Frontend Development
1. **Component Development**:
   - Create components in appropriate directories
   - Use TypeScript for type safety
   - Follow React best practices and hooks
   - Implement responsive design with Tailwind CSS

2. **State Management**:
   - Use React Context for global state
   - Implement proper error boundaries
   - Handle loading and error states

3. **API Integration**:
   - Use service layer for API calls
   - Implement proper error handling
   - Add authentication headers automatically

### Backend Development
1. **API Development**:
   - Follow RESTful conventions
   - Implement proper HTTP status codes
   - Add comprehensive validation
   - Use DTOs for request/response objects

2. **Database Operations**:
   - Use Spring Data MongoDB repositories
   - Implement transaction management
   - Add proper indexing for performance

3. **Security Implementation**:
   - JWT token validation
   - Role-based access control
   - Input sanitization and validation

### Database Setup
- Set up MongoDB cluster for production
- Configure proper indexing for performance
- Implement backup and recovery procedures
- Set up monitoring and alerting