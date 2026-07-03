const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database");

describe("Teams API", () => {
  beforeEach(() => {
    db.prepare("DELETE FROM teams").run();
  });

  test("POST /teams creates a team", async () => {
    const res = await request(app)
      .post("/teams")
      .send({
        name: "Engineering"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Engineering");
  });

  test("GET /teams returns all teams", async () => {
    await request(app)
      .post("/teams")
      .send({
        name: "Engineering"
      });

    const res = await request(app).get("/teams");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Engineering");
  });

  test("GET /teams/:id returns one team", async () => {
    const createRes = await request(app)
      .post("/teams")
      .send({
        name: "Engineering"
      });

    const teamId = createRes.body.id;

    const res = await request(app).get(`/teams/${teamId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(teamId);
    expect(res.body.name).toBe("Engineering");
  });

  test("PUT /teams/:id updates a team", async () => {
    const createRes = await request(app)
      .post("/teams")
      .send({
        name: "Engineering"
      });

    const teamId = createRes.body.id;

    const res = await request(app)
      .put(`/teams/${teamId}`)
      .send({
        name: "Product"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(teamId);
    expect(res.body.name).toBe("Product");
  });

  test("DELETE /teams/:id deletes a team", async () => {
    const createRes = await request(app)
      .post("/teams")
      .send({
        name: "Engineering"
      });

    const teamId = createRes.body.id;

    const deleteRes = await request(app).delete(`/teams/${teamId}`);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await request(app).get(`/teams/${teamId}`);

    expect(getRes.statusCode).toBe(404);
    expect(getRes.body.error).toBe("Team not found");
  });

  test("POST /teams returns 400 when name is missing", async () => {
    const res = await request(app)
      .post("/teams")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Name is required");
  });

  test("GET /teams/:id returns 404 when team does not exist", async () => {
    const res = await request(app).get("/teams/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Team not found");
  });

  test("PUT /teams/:id returns 404 when team does not exist", async () => {
    const res = await request(app)
      .put("/teams/9999")
      .send({
        name: "Product"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Team not found");
  });

  test("DELETE /teams/:id returns 404 when team does not exist", async () => {
    const res = await request(app).delete("/teams/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Team not found");
  });
});
