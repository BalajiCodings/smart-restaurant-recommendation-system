import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js"; 
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001", 
  "https://tasty-treat.vercel.app", 
  /https:\/\/tasty-treat.*\.vercel\.app$/, 
  /https:\/\/.*\.vercel\.app$/, 
  process.env.FRONTEND_URL 
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin) return callback(null, true);
      
      
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        }
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

app.get("/", (req, res) => res.json({ 
  message: "TastyTrack API Running", 
  version: "1.0.0",
  endpoints: {
    auth: "/api/auth",
    users: "/api/users", 
    restaurants: "/api/restaurants",
    reviews: "/api/reviews"
  }
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);


app.get("/health", (req, res) => res.json({ status: "OK", timestamp: new Date().toISOString() }));


app.use(errorHandler);


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  });
}

export default app;
