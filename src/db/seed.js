const db = require("./database");

const users = [
  { id: 1, name: "Daroush", email: "daroush@example.com" },
  { id: 2, name: "Wargsen", email: "wargsen@example.com" },
  { id: 3, name: "Ceri", email: "ceri@example.com" }
];

const teams = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Product" }
];

const memberships = [
  { id: 1, team_id: 1, user_id: 1, role: "owner" },
  { id: 2, team_id: 1, user_id: 2, role: "member" },
  { id: 3, team_id: 2, user_id: 3, role: "admin" }
];

const notes = [
  {
    id: 1,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 1",
    content: "Review priorities, assign tasks, and confirm blockers."
  },
  {
    id: 2,
    user_id: 2,
    team_id: 1,
    title: "API cleanup",
    content: "Refactor route handlers and keep service validation consistent."
  },
  {
    id: 3,
    user_id: 3,
    team_id: 2,
    title: "Launch checklist",
    content: "Confirm QA, release notes, and customer communication."
  },  {
    id: 4,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 4",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 5,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 5",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 6,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 6",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 7,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 7",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 8,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 8",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 9,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 9",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 10,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 10",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 11,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 11",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 12,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 12",
    content: "Review priorities, assign tasks, and confirm blockers."
  },  {
    id: 13,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 13",
    content: "Review priorities, assign tasks, and confirm blockers."
  }, {
    id: 14,
    user_id: 1,
    team_id: 1,
    title: "Zebra sprint planning 14",
    content: "Review priorities, assign tasks, and confirm blockers."
  },{
    id: 15,
    user_id: 1,
    team_id: 1,
    title: "Sprint planning 15",
    content: "Review priorities, assign tasks, and zip blockers."
  },{
    id: 16,
    user_id: 1,
    team_id: 1,
    title: "Zebra sprint planning 16",
    content: "Review priorities, assign tasks, and zip blockers."
  },
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
      membership.team_id,
      membership.user_id,
      membership.role
    );
  }

  for (const note of notes) {
    insertNote.run(
      note.id,
      note.user_id,
      note.team_id,
      note.title,
      note.content
    );
  }
});

seed();
db.close();

console.log("Seed data inserted");
