import db from "../config/db.js";

export const sendMail = async (req, res) => {
	try {
		const { receiver_email, subject, body } = req.body;

		if(!receiver_email || !subject || !body) {
			return res.status(400).json({ message: "❌ Datos incompletos" });
		}
		// Verificar que el receptor exista
		const [receiver] = await db.query(
			"SELECT id FROM users WHERE email=?",
			[receiver_email]
		);

		if (!receiver.length) {
			return res.status(400).json({ error: "❌ El receptor no existe" });
		}

		await db.query(
			"INSERT INTO mails (sender_id, receiver_email, subject, body) VALUES (?,?,?,?)",
			[req.user.id, receiver_email, subject, body]
		);

		res.json({ message: "Correo enviado" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "❌ Error al enviar correo" });
	}
};

export const inbox = async (req, res) => {
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
// sendMail: Valida datos, Verifica que el receptor exista, Inserta correo de forma segura, Maneja errores con try/catch
// inbox: Obtiene el email real del usuario autenticado, Busca correos recibidos, Ordena por fecha descendente, Nunca rompe si no hay correos
// Este archivo ya es: Seguro, Estable, Escalable, Sin errores silenciosos