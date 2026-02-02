import "dotenv/config";
import app from "./app.js";
import logger from "./config/logger.js";
import { initDb } from "./config/initDb.js";

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await initDb(); // DB primero
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Error iniciando el servidor:", error.message);
    process.exit(1);
  }
}

startServer();
// Punto único de arranque, Log claro al iniciar