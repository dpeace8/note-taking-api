const teamService = require("../services/teamService");

function getAllTeams(req, res, next) {
  try {
    const teams = teamService.getAllTeams();
    res.json(teams);
  } catch (error) {
    next(error);
  }
}

function getTeamById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const team = teamService.getTeamById(id);
    res.json(team);
  } catch (error) {
    next(error);
  }
}

function createTeam(req, res, next) {
  try {
    const team = teamService.createTeam(req.body);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
}

function updateTeam(req, res, next) {
  try {
    const id = Number(req.params.id);
    const team = teamService.updateTeam(id, req.body);
    res.json(team);
  } catch (error) {
    next(error);
  }
}

function deleteTeam(req, res, next) {
  try {
    const id = Number(req.params.id);
    teamService.deleteTeam(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
};