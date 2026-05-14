import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/usersRoutes.js";
import rolesRouter from "./routes/rolesRoutes.js";
import authRoutes from "./routes/auth.js";
dotenv.config();
import { authMiddleware } from "./middlewares/authMiddleware";
import cookieParser from "cookie-parser";
import permissionsRouter from "./routes/rolesPermissionsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:3000"
).split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS não permitido"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/roles", authMiddleware, rolesRouter);
app.use("/api/permissions", authMiddleware, permissionsRouter);

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
