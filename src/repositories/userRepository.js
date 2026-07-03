const db = require("../db/database");

function findAll() {
  return db.prepare(`
    SELECT id, name, email, created_at
    FROM users
    ORDER BY created_at DESC
  `).all();
}

function findById(id) {
  return db.prepare(`
    SELECT id, name, email, created_at
    FROM users
    WHERE id = ?
  `).get(id);
}

function create(user) {
  const result = db.prepare(`
    INSERT INTO users (name, email)
    VALUES (?, ?)
  `).run(user.name, user.email);

  return findById(result.lastInsertRowid);
}

function update(id, user) {
  db.prepare(`
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
  `).run(user.name, user.email, id);

  return findById(id);
}

function remove(id) {
  return db.prepare(`
    DELETE FROM users
    WHERE id = ?
  `).run(id);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};