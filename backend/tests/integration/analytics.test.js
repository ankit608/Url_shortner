import request from "supertest";
import app from "../server";
import { sequelize} from "../../src/config/db.js"
import User from "../../src/models/user.js";
import Url from "../../src/models/url.js";
import Click from "../../src/models/click.js";

describe("URL Analytics API Tests", () => {
  let shortUrlAlias;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const user = await User.create({
      id: "test-user-id",
      googleId: "mock-google-id",
      email: "test@example.com",
      name: "Test User",
    });

    const url = await Url.create({
      id: "test-url-id",
      longUrl: "https://example.com",
      shortUrl: "testAlias",
      userId: user.id,
    });

    shortUrlAlias = url.shortUrl;

    await Click.bulkCreate([
      { id: "click-1", urlId: url.id, ipAddress: "192.168.1.1", osType: "Windows", deviceType: "Desktop", clickedAt: new Date() },
      { id: "click-2", urlId: url.id, ipAddress: "192.168.1.2", osType: "MacOS", deviceType: "Laptop", clickedAt: new Date() },
    ]);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /api/urlanalytics/:alias should return analytics data", async () => {
    const response = await request(app)
      .get(`/api/urlanalytics/${shortUrlAlias}`)
      .set("Authorization", "Bearer mock-token");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("unique_user", 2);
  });
});
