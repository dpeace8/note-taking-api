const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database");

describe("Notes API", () => {
  let createdNoteId;
  let userId;

  beforeEach(async () => {
    db.prepare("DELETE FROM notes").run();
    db.prepare("DELETE FROM users").run();

    const userRes = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com"
      });

    userId = userRes.body.id;
  });

  test("POST /notes creates a note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        title: "First note",
        content: "This is my first note"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.user_id).toBe(userId);
    expect(res.body.title).toBe("First note");
    expect(res.body.content).toBe("This is my first note");

    createdNoteId = res.body.id;
  });

  test("GET /notes returns all notes", async () => {
    await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        title: "First note",
        content: "This is my first note"
      });

    const res = await request(app).get("/notes");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("First note");
  });

  test("GET /notes/:id returns one note", async () => {
    const createRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        title: "First note",
        content: "This is my first note"
      });

    const noteId = createRes.body.id;

    const res = await request(app).get(`/notes/${noteId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(noteId);
    expect(res.body.title).toBe("First note");
    expect(res.body.content).toBe("This is my first note");
  });

  test("PUT /notes/:id updates a note", async () => {
    const createRes = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
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
        content: "This note has no title"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User, title and content are required");
  });

  test("POST /notes returns 400 when content is missing", async () => {
    const res = await request(app)
      .post("/notes")
      .send({
        user_id: userId,
        title: "No content note"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User, title and content are required");
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
