const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database");

describe("Users API", () => {
  beforeEach(() => {
    db.prepare("DELETE FROM notes").run();
    db.prepare("DELETE FROM users").run();
  });

  test("POST /users creates a user", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test User");
    expect(res.body.email).toBe("test@example.com");
  });

  test("GET /users returns all users", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Test User");
    expect(res.body[0].email).toBe("test@example.com");
  });

  test("GET /users/:id returns one user", async () => {
    const createRes = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    const userId = createRes.body.id;

    const res = await request(app).get(`/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.name).toBe("Test User");
    expect(res.body.email).toBe("test@example.com");
  });

  test("PUT /users/:id updates a user", async () => {
    const createRes = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    const userId = createRes.body.id;

    const res = await request(app)
      .put(`/users/${userId}`)
      .send({
        name: "Updated User",
        email: "updated@example.com"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.name).toBe("Updated User");
    expect(res.body.email).toBe("updated@example.com");
  });

  test("DELETE /users/:id deletes a user", async () => {
    const createRes = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    const userId = createRes.body.id;

    const deleteRes = await request(app).delete(`/users/${userId}`);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await request(app).get(`/users/${userId}`);

    expect(getRes.statusCode).toBe(404);
    expect(getRes.body.error).toBe("User not found");
  });

  test("POST /users returns 400 when name is missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "test@example.com"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Name and email are required");
  });

  test("POST /users returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        name: "Test User"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Name and email are required");
  });

  test("GET /users/:id returns 404 when user does not exist", async () => {
    const res = await request(app).get("/users/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  test("PUT /users/:id returns 404 when user does not exist", async () => {
    const res = await request(app)
      .put("/users/9999")
      .send({
        name: "Updated User",
        email: "updated@example.com"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  test("DELETE /users/:id returns 404 when user does not exist", async () => {
    const res = await request(app).delete("/users/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});
