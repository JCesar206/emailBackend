import db from "../config/db.js";
// Crear carpeta
export const createFolder = async ( req, res) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Nombre requerido" });
		}

		await db.query("INSERT INTO folders (user_id, name) VALUES (?,?)", 
			[req.user.id, name]
		);
		res.status(201).json({ message: "Carpeta creada" });
	} catch (error) {
		console.error("Error createFolder:", error);
		res.status(500).json({ message: "❌ Error al crear carpeta" });
	}
};

// Listar carpetas del usuario
export const getFolders = async (req, res) => {
	try {
		cosnt [folders] = await db.query("SELECT id, name FROM folders WHERE user_id=?",
			[res.user.id]
		);
		res.json(folders);
	} catch (error) {
		console.error("Error getFolders", error);
		res.status(500).json({ message: "❌ Error al obtener carpetas" });
	}
};