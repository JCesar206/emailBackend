import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import "dotenv/config";

export async function initDb() {
	try {
		const sql = fs.readFileSync(
			path.resolve("src/database.sql"),
			"utf8"
		);

		const connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			multipleStatements: true
		});

		console.log("🛠️ Reiniciando base de datos...");
		await connection.query(sql);
		await connection.end();

		console.log("✅ Base de  Datos creada correctamente");
	} catch (error) {
		console.error("❌ Error inicializando DB: ", error.message);
	}
}