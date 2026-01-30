import "dotenv/config";
import bcrypt from "bcrypt";
import db from "../config/db.js";

async function seed() {
  try {
    console.log("🌱 Iniciando seed...");

    // Limpiar tablas (orden importa)
    await db.query("DELETE FROM mails");
    await db.query("DELETE FROM folders");
    await db.query("DELETE FROM users");

    console.log("🧹 Tablas limpiadas");

    // Crear usuarios
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

    // Crear carpetas
    const [folder] = await db.query(
      "INSERT INTO folders (user_id, name) VALUES (?, ?)",
      [user1.insertId, "Trabajo"]
    );

    console.log("📁 Carpeta creada");

    // Crear correo de prueba
    await db.query(
      `INSERT INTO mails 
        (sender_id, receiver_email, subject, body, is_read, folder_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user2.insertId,
        "user1@test.com",
        "Bienvenido 👋",
        "Este es tu primer correo de prueba.",
        0,
        folder.insertId
      ]
    );

    console.log("📩 Correo de prueba creado");
    console.log("✅ Seed completado con éxito");

    process.exit(0);

  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
}

seed();