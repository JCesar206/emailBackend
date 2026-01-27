import request from "supertest";
import app from "../src/app.js";

let tokenUser1;
let tokenUser2;

describe("Mail endpoints", () => {
	beforeAll(async () => {
		// Crear usuarios
		await request(app).post("/api/auth/register").send({
			email: "sender@test.com",
			password: "123456"
		});

		await request(app).post("/api/auth/register").send({
			email: "receiver@test.com",
			password: "123456"
		});

		// Login sender
		const login1 = await request(app)
		.post("/api/auth/login")
		.send({
			email: "sender@test.com",
			password: "123456"
		});

		tokenUser1 = login1.body.token;
		// Login receiver
		const login2 = await request(app)
		.post("/api/auth/login")
		.send({
			email: "receiver@test.com",
			password: "123456"
		});

		tokenUser2 = login2.body.token;
	});

	test("Send mail", async () => {
		const res = await request(app)
		.post("/api/mail")
		.set("Authorization", `Bearer ${tokenUser1}`)
		.send({
			receiver_email: "receiver@test.com",
			subject: "Test",
			body: "Mensaje test"
		});
		expect(res.statusCode).toBe(201);
		expect(res.body.message).toBeDefined();
	});

	test("Inbox receiver", async () => {
		const res = await request(app)
		.get("/api/mail")
		.set("Authorization", `Bearer ${tokenUser2}`);
		
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);
	});

	test("Send mail without token", async () => {
		const res = await request(app)
		.post("/api/mail")
		.send({
			receiver_email: "receriver@test.com",
			subject: "Fail",
			body: "Fail"
		});

		expect(res.statusCode).toBe(401);
	});
});