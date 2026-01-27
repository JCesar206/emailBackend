import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// Register
export const register = async (req, res) => {
  try {
    console.log("Register Body", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password requeridos"
      });
    }

    const [exists] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (exists.length) {
      return res.status(400).json({
        error: "Usuario ya existe"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );

    console.log("Usuario Registrado Ok", email);

    res.status(201).json({
      message: "Usuario creado correctamente"
    });

  } catch (error) {
    console.error("Error Register", error.message);
    console.error(error);
    res.status(500).json({
      error: "Error al registrar usuario"
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    console.log("Headers", req.headers);
    console.log("Content-Type", req.headers["content-type"]);
    console.log("Body", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password requeridos",
        bodyRecibido: req.body
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        error: "Usuario no existe"
      });
    }

    const valid = await bcrypt.compare(password, rows[0].password);

    if (!valid) {
      return res.status(401).json({
        error: "Password incorrecto"
      });
    }

    const token = jwt.sign(
      { id: rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Login Ok - Token Generado");

    res.json({ token });

  } catch (error) {
    console.error("Error en Login", error);
    res.status(500).json({
      error: "Error al iniciar sesión"
    });
  }
};