import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import {
  User,
  Project,
  Task,
  Comment,
  Subtask,
  Supervisor,
  Student,
  Mentorship,
  Follower,
  Post,
  Message,
} from "../models/index.js";
import defineAssociations from "../models/associations.js";
dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  dialect: "mysql",
  logging: false,
  models: [
    User,
    Project,
    Task,
    Comment,
    Subtask,
    Supervisor,
    Student,
    Mentorship,
    Follower,
    Post,
    Message,
  ],
});
defineAssociations();
sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

export default sequelize;
