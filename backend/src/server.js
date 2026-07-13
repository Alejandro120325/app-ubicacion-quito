import app from "./app.js";
import { databaseService } from "./services/database.service.js";

const PORT = Number(process.env.PORT) || 4000;
const APP_NAME = process.env.APP_NAME || "GeoKipu";

databaseService
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`${APP_NAME} backend escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`No se pudo inicializar el almacenamiento: ${error.message}`);
    process.exitCode = 1;
  });
