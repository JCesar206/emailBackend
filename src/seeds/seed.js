import "dotenv/config";
import bcrypt from "bcrypt";
import db from "../config/db.js";

async function seed() {
  try {
    console.log("🌱 Iniciando seed...");

    // LIMPIAR TABLAS
    await db.query("DELETE FROM attachments");
    await db.query("DELETE FROM mail_folders");
    await db.query("DELETE FROM mails");
    await db.query("DELETE FROM folders");
    await db.query("DELETE FROM users");

    console.log("🧹 Tablas limpiadas");

    // CREAR USUARIOS
    const passwordHash = await bcrypt.hash("123456", 10);

    const [user1] = await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      ["user1@test.com", passwordHash]
    );

    const [user2] = await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      ["user2@test.com", passwordHash]
    );

    console.log("👤 Usuarios creados");

    // CREAR CARPETAS
    const [inboxFolder] = await db.query(
      "INSERT INTO folders (user_id, name) VALUES (?, ?)",
      [user1.insertId, "Inbox"]
    );

    const [workFolder] = await db.query(
      "INSERT INTO folders (user_id, name) VALUES (?, ?)",
      [user1.insertId, "Trabajo"]
    );

    console.log("📁 Carpetas creadas");

    // CREAR CORREO
    const [mail] = await db.query(
      `INSERT INTO mails 
        (sender_id, receiver_email, subject, body, is_read)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user2.insertId,
        "user1@test.com",
        "Bienvenido 👋",
        "Este es tu primer correo de prueba.",
        false
      ]
    );

    console.log("📩 Correo creado");

    // ASOCIAR MAIL A CARPETA
    await db.query(
      "INSERT INTO mail_folders (mail_id, folder_id) VALUES (?, ?)",
      [mail.insertId, inboxFolder.insertId]
    );

    console.log("🗂️ Correo asignado a carpeta");

    console.log("✅ Seed completado con éxito");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
}

seed();