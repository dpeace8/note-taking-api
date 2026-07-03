const teamRepository = require("../repositories/teamRepository");

function getAllTeams() {
  return teamRepository.findAll();
}

function getTeamById(id) {
  const team = teamRepository.findById(id);

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  return team;
}

function createTeam(data) {
  if (!data.name) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  return teamRepository.create({
    name: data.name
  });
}

function updateTeam(id, data) {
  const existingTeam = teamRepository.findById(id);

  if (!existingTeam) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (!data.name) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  return teamRepository.update(id, {
    name: data.name
  });
}

function deleteTeam(id) {
  const existingTeam = teamRepository.findById(id);

  if (!existingTeam) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  teamRepository.remove(id);
}

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
};
