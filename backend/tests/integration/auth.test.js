import request from "supertest";
import app from "../../index.js";
import { sequelize } from "../../src/config/db.js";

jest.mock("../middleware/authMiddleware", () => require("../__mocks__/authMiddleware"));

describe("Authentication API Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /auth/google should redirect to Google OAuth", async () => {
    const response = await request(app).get("/auth/google");
    expect(response.status).toBe(302); // Redirect
  });

  test("GET /auth/google/callback should authenticate and return a token", async () => {
    const response = await request(app).get("/auth/google/callback?code=mockCode");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
