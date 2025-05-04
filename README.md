# MERN Stack Website - Project README

This README provides a detailed guide to setting up and using this MERN (MongoDB, Express.js, React.js, Node.js) stack website. Follow these instructions to get the project running on your local machine.

## Table of Contents

1.  [Prerequisites](#prerequisites)
2.  [Project Structure](#project-structure)
3.  [Backend Setup](#backend-setup)
    - [Installation](#backend-installation)
    - [Environment Variables](#backend-environment-variables)
    - [Running the Backend](#running-the-backend)
4.  [Frontend Setup](#frontend-setup)
    - [Installation](#frontend-installation)
    - [Environment Variables](#frontend-environment-variables)
    - [Running the Frontend](#running-the-frontend)
5.  [Database Setup](#database-setup)
6.  [Usage](#usage)
    - [Accessing the Website](#accessing-the-website)
    - [Key Features](#key-features)

## 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js:** (Ideally the latest LTS version). You can download it from [https://nodejs.org/](https://nodejs.org/).
- **npm (Node Package Manager):** This usually comes bundled with Node.js. You can check your version by running `npm -v` in your terminal.
- **MongoDB:** You need a MongoDB database instance running. You can:
  - Install MongoDB Community Server locally from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
  - Use a cloud-based MongoDB service like MongoDB Atlas ([https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)).
- **Git:** For version control. You can download it from [https://git-scm.com/](https://git-scm.com/).

## 2. Project Structure

The project is structured into two main directories: `backend` and `frontend`.

- **`backend`:** Contains the server-side code written in Node.js using Express.js. It handles API endpoints, database interactions, and business logic.
- **`frontend`:** Contains the client-side code written in React.js. It handles the user interface and makes API calls to the backend.

## 3. Backend Setup

Follow these steps to set up the backend of the application.

### Backend Installation

1.  Navigate to the `backend` directory in your terminal:

    ```bash
    cd backend
    ```

2.  Install the required Node.js packages using npm:

    ```bash
    npm install
    ```

    This command reads the `package.json` file and installs all the dependencies listed there (e.g., `express`, `mongoose`, `bcrypt`, `jsonwebtoken`, etc.).

### Backend Environment Variables

1.  In the `backend` directory, create a new file named `.env`.

2.  Open the `.env` file and add the following environment variables. **Replace the placeholder values with your actual configurations.**

    ```env
    PORT=4000             # The port your backend server will run on
    MONGODB_URI=mongodb://localhost:27017/your_database_name  # Your MongoDB connection URI. Replace 'your_database_name'
                                                            # with the name of your database. If using MongoDB Atlas,
                                                            # use the connection string provided by Atlas.
    JWT_SECRET=your_secret_jwt_key       # A secret key used for signing JSON Web Tokens for authentication
    COOKIE_SECRET=your_secret_cookie_key  # A secret key used for signing cookies (if you're using them)

    # Add any other backend-specific environment variables here, for example:
    # EMAIL_HOST=smtp.example.com
    # EMAIL_PORT=587
    # EMAIL_USER=your_email@example.com
    # EMAIL_PASSWORD=your_email_password
    ```

    **Important:** Keep your `.env` file secure and do not commit it to version control (it's usually included in `.gitignore`).

### Running the Backend

1.  Make sure you are still in the `backend` directory in your terminal.

2.  Start the backend server using the following command:

    ```bash
    npm run dev         # If your package.json has a 'dev' script (often uses nodemon for auto-reloading)
    # OR
    npm start           # If your package.json has a 'start' script (usually for production-like execution)
    # OR
    node server.js      # If your main server file is named 'server.js'
    ```

3.  You should see a message in your terminal indicating that the backend server has started and is running on the specified port (e.g., "Server listening on port 4000").

## 4. Frontend Setup

Follow these steps to set up the frontend of the application.

### Frontend Installation

1.  Navigate to the `frontend` directory in your terminal:

    ```bash
    cd ../frontend
    ```

2.  Install the required Node.js packages using npm:

    ```bash
    npm install
    ```

    This command reads the `package.json` file and installs all the frontend dependencies (e.g., `react`, `react-dom`, `react-router-dom`, `@mui/material`, etc.).

### Frontend Environment Variables

1.  In the `frontend` directory, create a new file named `.env`. **Note:** For React applications, environment variables accessed in the browser need to be prefixed with `REACT_APP_`.

2.  Open the `.env` file and add the following environment variables. **Replace the placeholder values with your actual configurations.**

    ```env
    REACT_APP_API_BASE_URL=http://localhost:4000/user  # The base URL of your backend API for user-related routes.
                                                    # Adjust if your backend is running on a different host or port,
                                                    # or if you have a different base URL.
    # Add any other frontend-specific environment variables here, for example:
    # REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
    ```

    **Important:** Keep your `.env` file secure and do not commit it to version control (it's usually included in `.gitignore`).

### Running the Frontend

1.  Make sure you are still in the `frontend` directory in your terminal.

2.  Start the frontend development server using the following command:

    ```bash
    npm start
    ```

    This command typically starts a development server on `http://localhost:3000` (or another available port) and automatically reloads the browser when you make changes to the code.

3.  Open your web browser and navigate to the address provided by the `npm start` command (usually `http://localhost:3000`). You should now see the frontend of your website.

## 5. Database Setup

1.  Ensure that your MongoDB database is running. If you installed it locally, you might need to start the MongoDB service.

2.  The backend application, configured with the `MONGODB_URI` in the `.env` file, will attempt to connect to the specified database when it starts.

3.  If the database specified in the URI does not exist, MongoDB will usually create it automatically when the backend tries to store data for the first time.

4.  You might need to create collections and define schemas in your backend models (e.g., using Mongoose) to structure your data. Based on the provided backend routes, you likely have a `User` model and a `Message` model (as seen in your `messageSchema`).

## 6. Usage

### Accessing the Website

Once both the backend and frontend servers are running:

- Open your web browser and go to the address where the frontend is running (usually `http://localhost:3000`).
- The frontend will interact with the backend API endpoints (defined in your `backend/routes/user.js` and potentially other route files) to handle user registration, login, profile management, and fetching portfolio information. If you have implemented the message sending functionality, the frontend will also interact with the appropriate backend message routes.

### Key Features

Based on the provided backend routes, key features of this website likely include:

- **User Authentication:** Registration (`/user/register`) and login (`/user/login`).
- **User Session Management:** Logout (`/user/logout`).
- **User Profile:** Getting user details (`/user/profile`), updating profile information (`/user/update/profile`), and changing password (`/user/update/password`).
- **Public Portfolio View:** Fetching a user's profile information for a public portfolio (`/user/profile-portfolio`).
- **Password Recovery:** Initiating the forgot password process (`/user/password/forgot`) and resetting the password using a token (`/user/password/reset/:token`).
- **Message Management (if implemented):** Sending messages (to a backend endpoint like `/message/send`) and viewing/deleting messages (likely on an admin interface using `/message/getall` and `/message/delete/:id`).
