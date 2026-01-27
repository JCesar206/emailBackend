import jwt from "jsonwebtoken";

export default (req, res, next) => {
	const authHeader = req.headers.authorization;
	console.log("AUTH HEADER", authHeader);

	if (!authHeader) { return res.status(401).json({ message: "No authorization header" }); }
	const token = authHeader.split(" ")[1];
	if (!token) { return res.status(401).json({ message: "No token" }); }
	try { 
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};
// Protege rutas privadas, Código corto y claro