import mongoose from "mongoose";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/geokipu";

const getMongoUri = () => String(process.env.MONGODB_URI || DEFAULT_MONGODB_URI).trim();

export const isMongoConfigured = () => Boolean(getMongoUri());

export const connectMongoDB = async () => {
  const uri = getMongoUri();
  if (!uri) return false;

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 3000
  });

  return true;
};

export const disconnectMongoDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export const getMongoConnectionState = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};
