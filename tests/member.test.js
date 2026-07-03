const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database");

describe("Members API", () => {
  let teamId;
  let userId;

  beforeEach(async () => {
    db.prepare("DELETE FROM team_members").run();
    db.prepare("DELETE FROM notes").run();
    db.prepare("DELETE FROM teams").run();
    db.prepare("DELETE FROM users").run();

    const teamRes = await request(app)
      .post("/teams")
      .send({
        name: "Engineering"
      });

    const userRes = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    teamId = teamRes.body.id;
    userId = userRes.body.id;
  });

  test("POST /teams/:teamId/members adds a member", async () => {
    const res = await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId,
        role: "admin"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.team_id).toBe(teamId);
    expect(res.body.user_id).toBe(userId);
    expect(res.body.role).toBe("admin");
  });

  test("POST /teams/:teamId/members defaults role to member", async () => {
    const res = await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.role).toBe("member");
  });

  test("GET /teams/:teamId/members returns team members", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId,
        role: "owner"
      });

    const res = await request(app).get(`/teams/${teamId}/members`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].team_id).toBe(teamId);
    expect(res.body[0].user_id).toBe(userId);
    expect(res.body[0].name).toBe("Test User");
    expect(res.body[0].email).toBe("test@example.com");
    expect(res.body[0].role).toBe("owner");
  });

  test("GET /teams/:teamId/members/:userId returns one member", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId,
        role: "admin"
      });

    const res = await request(app).get(`/teams/${teamId}/members/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.team_id).toBe(teamId);
    expect(res.body.user_id).toBe(userId);
    expect(res.body.role).toBe("admin");
  });

  test("GET /users/:userId/teams returns teams for a user", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId,
        role: "owner"
      });

    const res = await request(app).get(`/users/${userId}/teams`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].team_id).toBe(teamId);
    expect(res.body[0].name).toBe("Engineering");
    expect(res.body[0].role).toBe("owner");
  });

  test("PUT /teams/:teamId/members/:userId updates member role", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId,
        role: "member"
      });

    const res = await request(app)
      .put(`/teams/${teamId}/members/${userId}`)
      .send({
        role: "admin"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.team_id).toBe(teamId);
    expect(res.body.user_id).toBe(userId);
    expect(res.body.role).toBe("admin");
  });

  test("DELETE /teams/:teamId/members/:userId removes a member", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId
      });

    const deleteRes = await request(app).delete(`/teams/${teamId}/members/${userId}`);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await request(app).get(`/teams/${teamId}/members/${userId}`);

    expect(getRes.statusCode).toBe(404);
    expect(getRes.body.error).toBe("Member not found");
  });

  test("POST /teams/:teamId/members returns 400 when user_id is missing", async () => {
    const res = await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        role: "member"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User ID is required");
  });

  test("POST /teams/:teamId/members returns 400 when role is invalid", async () => {
    const res = await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId,
        role: "viewer"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid role");
  });

  test("POST /teams/:teamId/members returns 404 when team does not exist", async () => {
    const res = await request(app)
      .post("/teams/9999/members")
      .send({
        user_id: userId
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Team not found");
  });

  test("POST /teams/:teamId/members returns 404 when user does not exist", async () => {
    const res = await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: 9999
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  test("POST /teams/:teamId/members returns 409 when member already exists", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId
      });

    const res = await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe("User is already a member of this team");
  });

  test("GET /teams/:teamId/members returns 404 when team does not exist", async () => {
    const res = await request(app).get("/teams/9999/members");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Team not found");
  });

  test("GET /teams/:teamId/members/:userId returns 404 when member does not exist", async () => {
    const res = await request(app).get(`/teams/${teamId}/members/${userId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Member not found");
  });

  test("GET /users/:userId/teams returns 404 when user does not exist", async () => {
    const res = await request(app).get("/users/9999/teams");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  test("PUT /teams/:teamId/members/:userId returns 400 when role is missing", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId
      });

    const res = await request(app)
      .put(`/teams/${teamId}/members/${userId}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Role is required");
  });

  test("PUT /teams/:teamId/members/:userId returns 400 when role is invalid", async () => {
    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        user_id: userId
      });

    const res = await request(app)
      .put(`/teams/${teamId}/members/${userId}`)
      .send({
        role: "viewer"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid role");
  });

  test("PUT /teams/:teamId/members/:userId returns 404 when member does not exist", async () => {
    const res = await request(app)
      .put(`/teams/${teamId}/members/${userId}`)
      .send({
        role: "admin"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Member not found");
  });

  test("DELETE /teams/:teamId/members/:userId returns 404 when member does not exist", async () => {
    const res = await request(app).delete(`/teams/${teamId}/members/${userId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Member not found");
  });
});
