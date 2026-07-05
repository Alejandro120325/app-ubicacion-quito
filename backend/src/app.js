import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import groupsRoutes from "./routes/groups.routes.js";
import locationRoutes from "./routes/location.routes.js";
import mapsRoutes from "./routes/maps.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { errorHandler, notFoundHandler } from "./utils/httpError.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API de ubicacion simulada para Quito funcionando"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/maps", mapsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
