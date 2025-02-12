import request from "supertest";
import app from "../../index.js";

describe("Rate Limiting API Tests", () => {
  let shortUrlAlias = "testAlias";

  test("Rate limiting should prevent excessive requests", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).get(`/${shortUrlAlias}`);
    }

    const response = await request(app).get(`/${shortUrlAlias}`);
    expect(response.status).toBe(429); // Too Many Requests
  });
});
