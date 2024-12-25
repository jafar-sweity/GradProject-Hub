import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import cors from "cors";
import connectMongoDB from "./MongoDB/index.js"; // MongoDB connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/", routes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database connected.");

    await sequelize.sync({ alter: true });
    console.log("MySQL Models synchronized.");

    await connectMongoDB();
    console.log("MongoDB connected.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
