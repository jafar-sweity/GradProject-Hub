var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import cors from "cors";
import connectMongoDB from "./MongoDB/index.js"; // MongoDB connection
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use("/", routes);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("MySQL Database connected.");
        yield sequelize.sync({ alter: true });
        console.log("MySQL Models synchronized.");
        yield connectMongoDB();
        console.log("MongoDB connected.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
    }
});
startServer();
//# sourceMappingURL=index.js.map