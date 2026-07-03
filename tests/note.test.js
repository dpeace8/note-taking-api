const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database");

describe("Notes API", () => {
  let createdNoteId;
  let userId;
  let teamId;

  beforeEach(async () => {
    db.prepare("DELETE FROM notes").run();
    db.prepare("DELETE FROM team_members").run();
    db.prepare("DELETE FROM teams").run();
    db.prepare("DELETE FROM users").run();

    const userRes = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    const teamRes = await request(app)
      .post("/teams")
      .send({
        name: "Engineering"
      });

    userId = userRes.body.id;
    teamId = teamRes.body.id;

    await request(app)
      .post(`/teams/${teamId}/members`)
      .send({
        userId
      });
  });

  test("POST /notes creates a note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "First note",
        content: "This is my first note"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.user_id).toBe(userId);
    expect(res.body.team_id).toBe(teamId);
    expect(res.body.title).toBe("First note");
    expect(res.body.content).toBe("This is my first note");

    createdNoteId = res.body.id;
  });

  test("GET /notes returns all notes", async () => {
    await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "First note",
        content: "This is my first note"
      });

    const res = await request(app).get("/notes");

    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.sort).toBe("desc");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].team_id).toBe(teamId);
    expect(res.body.data[0].title).toBe("First note");
  });

  test("GET /notes defaults to 10 notes per page", async () => {
    for (let index = 1; index <= 12; index += 1) {
      await request(app)
        .post("/notes")
        .send({
          user_id: userId,
          team_id: teamId,
          title: `Note ${index}`,
          content: `Content ${index}`
        });
    }

    const res = await request(app).get("/notes");

    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.sort).toBe("desc");
    expect(res.body.data.length).toBe(10);
  });

  test("GET /notes supports limit and page query params", async () => {
    for (let index = 1; index <= 12; index += 1) {
      await request(app)
        .post("/notes")
        .send({
          user_id: userId,
          team_id: teamId,
          title: `Note ${index}`,
          content: `Content ${index}`
        });
    }

    const res = await request(app).get("/notes?limit=5&page=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(5);
    expect(res.body.sort).toBe("desc");
    expect(res.body.data.length).toBe(5);
  });

  test("GET /notes sorts by id descending by default", async () => {
    const firstRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "First note",
        content: "First content"
      });

    const secondRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "Second note",
        content: "Second content"
      });

    const res = await request(app).get("/notes");

    expect(res.statusCode).toBe(200);
    expect(res.body.sort).toBe("desc");
    expect(res.body.data[0].id).toBe(secondRes.body.id);
    expect(res.body.data[1].id).toBe(firstRes.body.id);
  });

  test("GET /notes supports sorting by id ascending", async () => {
    const firstRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "First note",
        content: "First content"
      });

    const secondRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "Second note",
        content: "Second content"
      });

    const res = await request(app).get("/notes?sort=asc");

    expect(res.statusCode).toBe(200);
    expect(res.body.sort).toBe("asc");
    expect(res.body.data[0].id).toBe(firstRes.body.id);
    expect(res.body.data[1].id).toBe(secondRes.body.id);
  });

  test("GET /notes/:id returns one note", async () => {
    const createRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "First note",
        content: "This is my first note"
      });

    const noteId = createRes.body.id;

    const res = await request(app).get(`/notes/${noteId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(noteId);
    expect(res.body.team_id).toBe(teamId);
    expect(res.body.title).toBe("First note");
    expect(res.body.content).toBe("This is my first note");
  });

  test("PUT /notes/:id updates a note", async () => {
    const createRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "First note",
        content: "This is my first note"
      });

    const noteId = createRes.body.id;

    const res = await request(app)
      .put(`/notes/${noteId}`)
      .send({
        title: "Updated note",
        content: "This note has been updated"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(noteId);
    expect(res.body.title).toBe("Updated note");
    expect(res.body.content).toBe("This note has been updated");
  });

  test("DELETE /notes/:id deletes a note", async () => {
    const createRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "First note",
        content: "This is my first note"
      });

    const noteId = createRes.body.id;

    const deleteRes = await request(app).delete(`/notes/${noteId}`);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await request(app).get(`/notes/${noteId}`);

    expect(getRes.statusCode).toBe(404);
    expect(getRes.body.error).toBe("Note not found");
  });

  test("POST /notes returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        content: "This note has no title"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User, team, title and content are required");
  });

  test("POST /notes returns 400 when content is missing", async () => {
    const res = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        team_id: teamId,
        title: "No content note"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User, team, title and content are required");
  });

  test("POST /notes returns 400 when team is missing", async () => {
    const res = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        title: "No team note",
        content: "This note has no team"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User, team, title and content are required");
  });

  test("POST /notes returns 403 when user is not a team member", async () => {
    const userRes = await request(app)
      .post("/users")
      .send({
        name: "Other User",
        email: "other@example.com"
      });

    const res = await request(app)
      .post("/notes")
      .send({
        user_id: userRes.body.id,
        team_id: teamId,
        title: "Blocked note",
        content: "This user is not in the team"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("User is not a member of this team");
  });

  test("GET /notes/:id returns 404 when note does not exist", async () => {
    const res = await request(app).get("/notes/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Note not found");
  });

  test("PUT /notes/:id returns 404 when note does not exist", async () => {
    const res = await request(app)
      .put("/notes/9999")
      .send({
        title: "Updated note",
        content: "This note does not exist"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Note not found");
  });

  test("DELETE /notes/:id returns 404 when note does not exist", async () => {
    const res = await request(app).delete("/notes/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Note not found");
  });

  afterAll(() => {
    db.close();
  });
});
