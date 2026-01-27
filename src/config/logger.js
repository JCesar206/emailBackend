import winston from "winston";
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.simple()
	),
	transports: [
		new winston.transports.Console(),
	],
});

export default logger;
// Centraliza logs, Timestamp autómatico, Fácil de extender a archivos