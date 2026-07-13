import { getMongoConnectionState } from "../config/database.js";
import { databaseService } from "../services/database.service.js";

export const getHealth = (req, res) => {
  res.json({
    ok: true,
    app: process.env.APP_NAME || "GeoKipu",
    service: "backend",
    storage: databaseService.mode,
    mongodb: getMongoConnectionState(),
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
};
