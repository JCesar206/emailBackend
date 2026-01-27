import request from "supertest";
import app from "../src/app.js";
import { PassThrough } from "supertest/lib/test";

describe("Auth endpoints", () => {
	const user = {
		email: "test1@test.com",
		password: "123456"
	};

	test("Register user", async () => {
		const res = await request(app)
		.post("/api/auth/register")
		.send(user);
	expect(res.statusCode).toBe(201);
	expect(res.body.message).toBeDefined();
	});

	test("Login user", async () => {
		const res = await request(app)
		.post("/api/auth/login")
		.send(user);
	expect(res.statusCode).toBe(200);
	expect(res.body.token).toBeDefined();
	});

	test("Login fail with wrong password", async () => {
		const res = await request(app)
		.post("/api/auth/login")
		.send({
			email: user.email,
			password: "wrong"
		});
		expect(res.statusCode).toBe(401);
	});
});