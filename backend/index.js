import express from "express";
import dotenv from "dotenv";

// Connected To Mongodb
import { connectToMongoDB } from "./db/connectToMongoDB.js";

// Routes
import authRoutes from "./routes/auth.route.js";

const PORT = process.env.PORT || 5000;

// Load environment variables from a .env file into process.env
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

// Middleware to parse incoming JSON requests
app.use(express.json());

// This line sets up a middleware in the Express application to handle all routes starting with "/api/auth" using the authRoutes module.
app.use("/api/auth", authRoutes);

/*app.get("/", (req, res) => {
  res.send("Hello World!");
});*/

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server started on port ${PORT}`);
});
