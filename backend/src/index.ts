import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js"; // Sequelize for MySQL
import routes from "./routes/index.js"; // Your routes
import connectMongoDB from "./MongoDB/index.js"; // MongoDB connection
import Test from "./MongoDB/Test.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/add", async (req, res) => {
  try {
    const newTest = new Test({
      name: req.body.name || "Test Name",
    });
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (err) {
    res.status(500).json({ message: "Failed to insert document", error: err });
  }
});

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
