import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", routes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    await sequelize.sync({ alter: true });
    console.log("Models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
