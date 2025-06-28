// tests/auth.test.js
import request from "supertest";
import app from "../src/server.js";
import { User } from "../src/models/User.js";

describe("Auth Routes", () => {
  const testUser = {
    name: "Test",
    email: "test@example.com",
    password: "test1234"
  };

  test("registers a user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test("fails to register duplicate email", async () => {
    await User.create(testUser);
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already registered");
  });

  test("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("fails login with wrong password", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpass"
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
