const db = require("./database");

const users = [
  { id: 1, name: "Daroush", email: "daroush@example.com" },
  { id: 2, name: "War", email: "war@example.com" },
  { id: 3, name: "Ceri", email: "ceri@example.com" }
];

const teams = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Product" }
];

const memberships = [
  { id: 1, teamId: 1, userId: 1, role: "owner" },
  { id: 2, teamId: 1, userId: 2, role: "member" },
  { id: 3, teamId: 2, userId: 3, role: "admin" }
];

const notes = [
  {
    id: 1,
    userId: 1,
    teamId: 1,
    title: "Sprint planning",
    content: "Review priorities, assign tasks, and confirm blockers."
  },
  {
    id: 2,
    userId: 2,
    teamId: 1,
    title: "API cleanup",
    content: "Refactor route handlers and keep service validation consistent."
  },
  {
    id: 3,
    userId: 3,
    teamId: 2,
    title: "Launch checklist",
    content: "Confirm QA, release notes, and customer communication."
  }
];

const seed = db.transaction(() => {
  db.prepare("DELETE FROM notes").run();
  db.prepare("DELETE FROM team_members").run();
  db.prepare("DELETE FROM teams").run();
  db.prepare("DELETE FROM users").run();

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email)
    VALUES (?, ?, ?)
  `);

  const insertTeam = db.prepare(`
    INSERT INTO teams (id, name)
    VALUES (?, ?)
  `);

  const insertMember = db.prepare(`
    INSERT INTO team_members (id, team_id, user_id, role)
    VALUES (?, ?, ?, ?)
  `);

  const insertNote = db.prepare(`
    INSERT INTO notes (id, user_id, team_id, title, content)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const user of users) {
    insertUser.run(user.id, user.name, user.email);
  }

  for (const team of teams) {
    insertTeam.run(team.id, team.name);
  }

  for (const membership of memberships) {
    insertMember.run(
      membership.id,
      membership.teamId,
      membership.userId,
      membership.role
    );
  }

  for (const note of notes) {
    insertNote.run(
      note.id,
      note.userId,
      note.teamId,
      note.title,
      note.content
    );
  }
});

seed();
db.close();

console.log("Seed data inserted");
