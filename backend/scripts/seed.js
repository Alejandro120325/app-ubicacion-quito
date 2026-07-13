import dotenv from "dotenv";
import { connectMongoDB, disconnectMongoDB } from "../src/config/database.js";
import { seedLocalMongoData } from "../src/data/seedLocalData.js";

dotenv.config();

try {
  await connectMongoDB();
  const summary = await seedLocalMongoData();
  console.log("Seed local de GeoKipu finalizado.");
  console.table(summary);
} catch (error) {
  console.error(`No se pudo ejecutar el seed local: ${error.message}`);
  process.exitCode = 1;
} finally {
  await disconnectMongoDB().catch(() => undefined);
}
