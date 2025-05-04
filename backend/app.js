import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/DbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRoutes.js";
import userRouter from "./router/userRoutes.js";
import timelineRouter from "./router/timelineRoutes.js";
import softwareApplicationRouter from "./router/softwareApplicationRoutes.js";
import skillRouter from "./router/skillRoutes.js";
import projectRouter from "./router/projectRoutes.js";

const app = express();

dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);
app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/timeline", timelineRouter);
app.use("/softwareapplication", softwareApplicationRouter);
app.use("/skill", skillRouter);
app.use("/project", projectRouter);

dbConnection();
app.use(errorMiddleware);
export default app;
