# Unclutter Backend API

This is the backend API for the Unclutter mental wellness app. It provides authentication, user management, and will be expanded to support various modules including journaling, mood tracking, expense management, and more.

## Features

- Authentication (register, login, email verification, password reset)
- User profile management
- Module preferences (enable/disable features)
- Expandable architecture for adding new modules

## Tech Stack

- Node.js with Express.js
- MySQL database with Sequelize ORM
- JWT-based authentication
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and JWT secret

5. Create and set up the database:

```bash
npm run db:create    # Create the database if it doesn't exist
npm run db:migrate   # Run migrations to create tables
npm run db:seed:all  # Seed initial data (admin user)
```

6. Start the development server:

```bash
npm run dev
```

## Database Management

This project uses Sequelize ORM with MySQL for database management. The following tools and practices are implemented:

### Migrations

Migrations allow tracking and versioning of database schema changes:

```bash
npm run db:migrate           # Run pending migrations
npm run db:migrate:undo      # Revert the most recent migration
npm run db:migrate:undo:all  # Revert all migrations
```

Migration files are stored in `src/migrations/` and follow a timestamp naming convention.

### Seeders

Seeders provide initial data for the database:

```bash
npm run db:seed:all          # Run all seed files
npm run db:seed:undo:all     # Revert all seeds
```

Seed files are stored in `src/seeders/` and include an admin user by default.

### Models

Sequelize models define the structure and relationships of database tables. They are located in `src/models/` and include:

- User model: Authentication and user management
- Profile model: User profile information and preferences

Additional models will be added as new modules are implemented.

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `GET /api/v1/auth/verify-token` - Verify JWT token
- `POST /api/v1/auth/logout` - Logout user

### User Endpoints

- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/preferences` - Update user preferences
- `PUT /api/v1/users/modules` - Update enabled modules
- `PUT /api/v1/users/change-password` - Change password

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── models/         # Database models
├── routes/         # API routes
└── utils/          # Utility functions
```

## Future Modules

The backend is designed to be expanded with additional modules:

- Journal Module
- Mood Tracker Module
- Expense Manager Module
- Book Reader Module
- Planner/Vision Board Module

Each module will have its own models, controllers, and routes, following the same architectural pattern.
