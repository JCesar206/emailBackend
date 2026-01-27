import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import mailRoutes from "./routes/mail.routes.js";
import logger from "./config/logger.js";

const app = express();

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true,
	methods: ["GET","POST","PUT","DELETE","OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// Middleware de errores CORRECTO
app.use((err, req, res, next) => {
	logger.error(err.message);
	res.status(500).json({ message: "Error interno" });
});

export default app;
// Morgan para request, Middleware de error central, Rutas desacopladas