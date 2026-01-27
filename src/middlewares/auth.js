import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Log temporal para depuración
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "❌ No se envió el header Authorization"
    });
  }

  // Espera formato: "Bearer TOKEN"
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "❌ Formato de token inválido"
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (error) {
    return res.status(403).json({
      message: "❌ Token inválido o expirado"
    });
  }
};

export default authMiddleware;