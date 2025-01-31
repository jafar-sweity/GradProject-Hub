import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User, Semester, Project, Task, SubTask, Message, UserProjectRoles, UploadSetting, } from "../models/index.js";
import defineAssociations from "../models/associations.js";
dotenv.config();
const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: "mysql",
    logging: false,
    models: [
        User,
        Semester,
        Project,
        Task,
        SubTask,
        Message,
        UserProjectRoles,
        UploadSetting,
    ],
});
defineAssociations();
sequelize.sync().then(() => {
    console.log("Database & tables created!");
});
export default sequelize;
//# sourceMappingURL=database.js.map