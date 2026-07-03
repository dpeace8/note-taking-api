const memberRepository = require("../repositories/memberRepository");
const userRepository = require("../repositories/userRepository");
const teamRepository = require("../repositories/teamRepository");

const VALID_ROLES = ["owner", "admin", "member"];

function addMember(teamId, data) {
  const userId = Number(data.user_id);
  const role = data.role || "member";

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  if (!VALID_ROLES.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const team = teamRepository.findById(teamId);

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  const user = userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const existingMember = memberRepository.findByTeamAndUser(teamId, userId);

  if (existingMember) {
    const error = new Error("User is already a member of this team");
    error.statusCode = 409;
    throw error;
  }

  return memberRepository.addMember(teamId, userId, role);
}

function getMembersByTeam(teamId) {
  const team = teamRepository.findById(teamId);

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  return memberRepository.findMembersByTeam(teamId);
}

function getMemberByTeamAndUser(teamId, userId) {
  const member = memberRepository.findByTeamAndUser(teamId, userId);

  if (!member) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  return member;
}

function getTeamsByUser(userId) {
  const user = userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return memberRepository.findTeamsByUser(userId);
}

function updateMemberRole(teamId, userId, data) {
  const role = data.role;

  if (!role) {
    const error = new Error("Role is required");
    error.statusCode = 400;
    throw error;
  }

  if (!VALID_ROLES.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const existingMember = memberRepository.findByTeamAndUser(teamId, userId);

  if (!existingMember) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  return memberRepository.updateRole(teamId, userId, role);
}

function removeMember(teamId, userId) {
  const existingMember = memberRepository.findByTeamAndUser(teamId, userId);

  if (!existingMember) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  memberRepository.removeMember(teamId, userId);
}

module.exports = {
  addMember,
  getMembersByTeam,
  getMemberByTeamAndUser,
  getTeamsByUser,
  updateMemberRole,
  removeMember
};
