import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Example Route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Test database connection and sync models
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    await sequelize.sync({ alter: true }); // Use { force: true } for development (drops tables)
    console.log("Models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
