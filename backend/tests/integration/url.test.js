import request from "supertest";
import app from "../../index.js";
import { sequelize } from "../../src/config/db.js";
import{User} from "../../src/models/user.js";
import {Url} from "../../src/models/url.js"

describe("URL Shortener API Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a Mock User
    await User.create({
      id: "test-user-id",
      googleId: "mock-google-id",
      email: "test@example.com",
      name: "Test User",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /api/shorten should create a short URL", async () => {
    const response = await request(app)
      .post("/api/shorten")
      .set("Authorization", "Bearer mock-token")
      .send({ longUrl: "https://example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("shortUrl");
  });

  test("POST /api/custom should create a custom short URL", async () => {
    const response = await request(app)
      .post("/api/custom")
      .set("Authorization", "Bearer mock-token")
      .send({ longUrl: "https://example.com", customUrl: "customAlias" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("shortUrl", "customAlias");
  });
});
