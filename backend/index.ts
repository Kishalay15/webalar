import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { connectDB } from "./config/db";
import { initSocket } from "./config/socket";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import logRoutes from "./routes/logRouter";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logRoutes);

const PORT: number = parseInt(process.env.PORT || "5000", 10);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
