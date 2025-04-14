# Task Management Application

This is a full-stack task management application with a React frontend and Express.js backend.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- MySQL server

## Setup

### Clone the repository

```bash
git clone https://github.com/YogeshPatel8910/task
cd task
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tasks_db
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Database Setup

Create a MySQL database with the name specified in your environment variables.

## Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install express mysql2 sequelize bcrypt jsonwebtoken cors dotenv

# Start the development server
npm run dev

# For production
npm start
```

The backend server will run on http://localhost:5000 by default (or the PORT specified in your .env file).

## Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install axios bootstrap react-router-dom react-bootstrap

# Start the development server
npm start
```

The frontend development server will run on http://localhost:3000.

## Project Structure

```
├── backend/
│   ├── index.js           # Express server entry point
│   ├── package.json       # Backend dependencies
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   └── controllers/       # Route controllers
├── frontend/
│   ├── public/            # Public assets
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # Main application component
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## Available Scripts

### Backend

- `npm run dev`: Starts the server with nodemon for auto-reloading during development
- `npm start`: Starts the server in production mode
- `npm test`: Runs the tests (not configured yet)

### Frontend

- `npm start`: Starts the development server
- `npm build`: Builds the app for production
- `npm test`: Runs the tests
- `npm eject`: Ejects from create-react-app

## Technologies Used

### Backend
- Express.js (v5.1.0)
- Sequelize ORM (v6.37.7)
- MySQL2 (v3.14.0)
- JSON Web Tokens (v9.0.2)
- bcrypt (v5.1.1)

### Frontend
- React (v19.1.0)
- React Router (v7.5.0)
- Axios (v1.8.4)
- Bootstrap (v5.3.5)
- React Bootstrap (v2.10.9)
