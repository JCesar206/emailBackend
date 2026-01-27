import "dotenv/config";
import app from "./app.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
// Punto único de arranque, Log claro al iniciar