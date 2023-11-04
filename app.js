import express from "express";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app = express();
config({
  path: "./data/config.env",
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//user router
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("check");
});

//error middleware
app.use(errorMiddleware);
