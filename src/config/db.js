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

pool.getConnection()
	.then(() => logger.info("✅ MySQL conectado"))
	.catch(err => logger.error(err.message));

export default pool;
// Explicación: Usamos pool para eficiencia, Conexión validada al iniciar, Logs claros si algo falla