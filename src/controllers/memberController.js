const memberService = require("../services/memberService");

function addMember(req, res, next) {
  try {
    const teamId = Number(req.params.teamId);
    const member = memberService.addMember(teamId, req.body);

    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
}

function getMembersByTeam(req, res, next) {
  try {
    const teamId = Number(req.params.teamId);
    const members = memberService.getMembersByTeam(teamId);

    res.json(members);
  } catch (error) {
    next(error);
  }
}

function getMemberByTeamAndUser(req, res, next) {
  try {
    const teamId = Number(req.params.teamId);
    const userId = Number(req.params.userId);

    const member = memberService.getMemberByTeamAndUser(teamId, userId);

    res.json(member);
  } catch (error) {
    next(error);
  }
}

function getTeamsByUser(req, res, next) {
  try {
    const userId = Number(req.params.userId);
    const teams = memberService.getTeamsByUser(userId);

    res.json(teams);
  } catch (error) {
    next(error);
  }
}

function updateMemberRole(req, res, next) {
  try {
    const teamId = Number(req.params.teamId);
    const userId = Number(req.params.userId);

    const member = memberService.updateMemberRole(teamId, userId, req.body);

    res.json(member);
  } catch (error) {
    next(error);
  }
}

function removeMember(req, res, next) {
  try {
    const teamId = Number(req.params.teamId);
    const userId = Number(req.params.userId);

    memberService.removeMember(teamId, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addMember,
  getMembersByTeam,
  getMemberByTeamAndUser,
  getTeamsByUser,
  updateMemberRole,
  removeMember
};