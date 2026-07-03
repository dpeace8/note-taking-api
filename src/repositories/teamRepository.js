const db = require("../db/database");

function findAll() {
  return db.prepare(`
    SELECT id, name, created_at
    FROM teams
    ORDER BY created_at DESC
  `).all();
}

function findById(id) {
  return db.prepare(`
    SELECT id, name, created_at
    FROM teams
    WHERE id = ?
  `).get(id);
}

function create(team) {
  const result = db.prepare(`
    INSERT INTO teams (name)
    VALUES (?)
  `).run(team.name);

  return findById(result.lastInsertRowid);
}

function update(id, team) {
  db.prepare(`
    UPDATE teams
    SET name = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(team.name, id);

  return findById(id);
}

function remove(id) {
  return db.prepare(`
    DELETE FROM teams
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