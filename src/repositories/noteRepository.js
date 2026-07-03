const db = require("../db/database");

function findAll() {
  return db.prepare(`
    SELECT id, user_id, title, content, created_at, updated_at
    FROM notes
    ORDER BY created_at DESC
  `).all();
}

function findById(id) {
  return db.prepare(`
    SELECT id, user_id, title, content, created_at, updated_at
    FROM notes
    WHERE id = ?
  `).get(id);
}

function create(note) {
  const result = db.prepare(`
    INSERT INTO notes (user_id, title, content)
    VALUES (?, ?, ?)
  `).run(note.user_id, note.title, note.content);

  return findById(result.lastInsertRowid);
}

function update(id, note) {
  db.prepare(`
    UPDATE notes
    SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(note.title, note.content, id);

  return findById(id);
}

function remove(id) {
  return db.prepare(`
    DELETE FROM notes
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
