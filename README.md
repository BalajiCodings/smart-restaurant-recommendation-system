TastyTrack - Smart Restaurant Recommendation System
Live Link: https://smart-restaurant-recommendation-sys.vercel.app/ (If any suggestions or Corrections, Kindly contact me!)
Contact options: Linkedin - www.linkedin.com/in/balajisubash03/
Gmail : balajisubash956@gmail.com

Project Overview and Tech Stack:
TastyTrack is a full-stack web application designed to offer intelligent and personalized restaurant recommendations based on a user’s preferences, favorite cuisines, and review history. It simplifies the dining decision-making process by analyzing a user's behavior and suggesting relevant restaurants. The backend is built using Node.js with Express.js as the server framework and MongoDB as the database, interfaced through Mongoose ODM. The frontend is developed using React.js (Vite) for a fast and responsive UI. Authentication and session management are handled via JWT (JSON Web Tokens). Additional tools like bcryptjs (for password hashing), express-validator (for input validation), express-rate-limit, and CORS are used to ensure security, input safety, and scalability of the application.

REST API Endpoints Overview:
POST /api/auth/register – Register a new user account

POST /api/auth/login – Log in and get a JWT token

POST /api/auth/refresh – Refresh token to extend session

GET /api/users/profile – Get logged-in user’s profile

GET /api/users/dashboard – Get user data and review history

PUT /api/users/preferences/cuisines – Update preferred cuisines

GET /api/users/favorites – Get list of favorite restaurants

POST /api/users/favorites/:restaurantId – Add a restaurant to favorites

DELETE /api/users/favorites/:restaurantId – Remove a restaurant from favorites

GET /api/users/reviews – Get all reviews made by the user

PUT /api/users/change-password – Change current password

GET /api/users/admin/all – [Admin] Get list of all users

GET /api/restaurants – Get paginated list of all restaurants

GET /api/restaurants/:id – Get detailed info for a restaurant

POST /api/restaurants – [Admin] Add a new restaurant

GET /api/restaurants/search?q=... – Search restaurants by name/cuisine

GET /api/restaurants/recommendations – Get personalized restaurant recommendations

POST /api/reviews/:restaurantId – Add a review for a restaurant

PUT /api/reviews/:reviewId – Edit an existing review

DELETE /api/reviews/:reviewId – Delete an existing review


Backend Architecture:
Routes: Defined for each domain (authRoutes, userRoutes, restaurantRoutes, reviewRoutes) and mounted in server.js.

Controllers: Contain business logic for each route (e.g., creating reviews, authenticating users).

Middleware: Handles authentication (authenticate), role-based access (requireRole), input validation (validate), and centralized error handling (errorHandler).

Utils: Contains JWT token handling logic.

Config: Contains the MongoDB connection logic.

Environment Variables: Used for secrets, database URL, and port (via .env and dotenv).


Intelligent Recommendation System:
TastyTrack includes a personalized recommendation engine that suggests restaurants to users based on their culinary interests, activity history, and explicit preferences. This system is designed to be user-specific and context-aware, enhancing the user experience by offering relevant dining choices.

