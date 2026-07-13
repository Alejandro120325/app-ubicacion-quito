import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import groupsRoutes from "./routes/groups.routes.js";
import healthRoutes from "./routes/health.routes.js";
import locationRoutes from "./routes/location.routes.js";
import locationsRoutes from "./routes/locations.routes.js";
import mapsRoutes from "./routes/maps.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { errorHandler, notFoundHandler } from "./utils/httpError.js";

dotenv.config();

const app = express();
const appName = process.env.APP_NAME || "GeoKipu";
const defaultLocalOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultLocalOrigins, ...configuredOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Origen no permitido por CORS."));
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    app: appName,
    message: `API de ${appName} funcionando`
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/maps", mapsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
