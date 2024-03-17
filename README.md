# Web Chat Application - Backend

## Overview
The backend for the web chat application is developed using Node.js and Express.js. It provides the server-side logic for user authentication, message routing, and real-time communication via WebSocket using Socket.IO. PostgreSQL is used as the database to store user data and message history. The backend is developed using TypeScript for type safety and improved code maintainability.

## Technologies Used
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework for Node.js
- **JWT**: JSON Web Tokens for user authentication
- **Socket.IO**: Real-time communication between clients and server
- **PostgreSQL**: Relational database management system
- **TypeScript**: Superset of JavaScript for enhanced type checking and readability

## Installation
1. Clone the repository
2. Navigate to the backend directory
3. Run `npm install` to install dependencies
4. Set up PostgreSQL database and update the configuration in `.env` file
5. Run `npm start` to start the server

## Configuration
- Create a `.env` file based on the `.env.example` template and fill in the required environment variables such as database connection details and JWT secret.

## Usage
- The backend server exposes RESTful APIs for user authentication, message handling, and other functionalities.
- WebSocket server enables real-time messaging between clients.
