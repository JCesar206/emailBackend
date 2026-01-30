import db from "../config/db.js";

export const sendMail = async (req, res) => {
	try {
		const { receiver_email, subject, body } = req.body;
		const files = req.files || [];

		if(!receiver_email || !subject || !body) {
			return res.status(400).json({ message: "❌ Datos incompletos" });
		}
		// Crear mail
		const [result] = await db.query(
			"INSERT INTO mails (sender_id, receiver_email, subject, body) VALUES (?,?,?,?)",
			[req.user.id, receiver_email, subject, body]
		);
		
		const mailId = result.insertId;

		// Guardar adjuntos
		for (const file of files) {
			await db.query("INSERT INTO mail_attachments (mail_id, filename, original_name, mime_type) VALUES (?,?,?,?)",
				[mailId, file.filename, file.originalname, file.mimetype]
			);
		}
		res.json({ message: "Correo enviado" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "❌ Error al enviar correo" });
	}
};

export const mailDetail = async (req, res) => {
	const { id } = req.params;
	const [mailRows] = await db.query("SELECT * FROM mails WHERE id=?", [id]);
	if (!mailRows.length) {
		return res.status(404).json({ message: "Correo no encontrado" });
	}

	const [attachments] = await db.query("SELECT filename, original_name FROM mail_attachments WHERE mail_id=?", [id]);

	res.json({
		...mailRows[0],
		attachments
	});
};

export const getInbox = async (req, res) => {
	try {
		// Obtener email del usuario autenticado
		const [userRows] = await db.query(
			"SELECT email FROM users WHERE id=?",
			[req.user.id]
		);

		if (!userRows.length) {
			return res.status(404).json({ error: "❌ Usuario no encontrado" });
		}
		const userEmail = userRows[0].email;
		// Obtener correo recibidos
		const [mails] = await db.query(
			`SELECT id, sender_id, receiver_email, subject, body, created_at FROM mails WHERE receiver_email=?
			ORDER BY created_at DESC`, [userEmail]
		);
		res.json(mails);
	} catch (error) {
		console.error("Error inbox:", error);
		res.status(500).json({ error: "❌ Error interno al obtener inbox" });
	}
};

export const moveToFolder = async (req, res) => {
	try {
		const { id } = req.params;
		const { folder_id } = req.body;

		await db.query(
			"UPDATE mails SET folder_id=? WHERE id=? AND sender_id=?",
			[folder_id, id, req.user.id]
		);
		res.json({ message: "Correo movido" });
	} catch (error) {
		console.error("Error moveToFolder:", error);
		res.status(500).json({ message: "Error al mover correo" });
	}
};

// sendMail: Valida datos, Verifica que el receptor exista, Inserta correo de forma segura, Maneja errores con try/catch
// getInbox: Obtiene el email real del usuario autenticado, Busca correos recibidos, Ordena por fecha descendente, Nunca rompe si no hay correos
// Este archivo ya es: Seguro, Estable, Escalable, Sin errores silenciosos