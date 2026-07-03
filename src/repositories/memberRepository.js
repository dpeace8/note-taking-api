const db = require("../db/database");

function addMember(teamId, userId, role) {
  const result = db.prepare(`
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (?, ?, ?)
  `).run(teamId, userId, role);

  return findById(result.lastInsertRowid);
}

function findById(id) {
  return db.prepare(`
    SELECT id, team_id, user_id, role, created_at
    FROM team_members
    WHERE id = ?
  `).get(id);
}

function findByTeamAndUser(teamId, userId) {
  return db.prepare(`
    SELECT id, team_id, user_id, role, created_at
    FROM team_members
    WHERE team_id = ? AND user_id = ?
  `).get(teamId, userId);
}

function findMembersByTeam(teamId) {
  return db.prepare(`
    SELECT 
      team_members.id,
      team_members.team_id,
      team_members.user_id,
      users.name,
      users.email,
      team_members.role,
      team_members.created_at
    FROM team_members
    JOIN users ON users.id = team_members.user_id
    WHERE team_members.team_id = ?
    ORDER BY team_members.created_at DESC
  `).all(teamId);
}

function findTeamsByUser(userId) {
  return db.prepare(`
    SELECT 
      team_members.id AS membership_id,
      teams.id AS team_id,
      teams.name,
      team_members.role,
      team_members.created_at
    FROM team_members
    JOIN teams ON teams.id = team_members.team_id
    WHERE team_members.user_id = ?
    ORDER BY team_members.created_at DESC
  `).all(userId);
}

function updateRole(teamId, userId, role) {
  db.prepare(`
    UPDATE team_members
    SET role = ?
    WHERE team_id = ? AND user_id = ?
  `).run(role, teamId, userId);

  return findByTeamAndUser(teamId, userId);
}

function removeMember(teamId, userId) {
  return db.prepare(`
    DELETE FROM team_members
    WHERE team_id = ? AND user_id = ?
  `).run(teamId, userId);
}

module.exports = {
  addMember,
  findById,
  findByTeamAndUser,
  findMembersByTeam,
  findTeamsByUser,
  updateRole,
  removeMember
};