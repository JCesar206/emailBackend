import "dotenv/config";
import mysql from "mysql2/promise";
import logger from "./logger.js";

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// Verificación de conexión (sin bloquear el pool)
(async () => {
	try {
		const connection = await pool.getConnection();
		logger.info("✅ MySQL conectado correctamente");
		connection.release();
	} catch (error) {
		logger.error("❌ Error conectando a MySQL", error.message);
	}
})();

export default pool;
// Explicación: Usamos pool para eficiencia, Conexión validada al iniciar, Logs claros si algo falla