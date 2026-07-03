const express = require("express");
const teamController = require("../controllers/teamController");
const memberController = require("../controllers/memberController");

const router = express.Router();

router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);
router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

router.post("/:teamId/members", memberController.addMember);
router.get("/:teamId/members", memberController.getMembersByTeam);
router.get("/:teamId/members/:userId", memberController.getMemberByTeamAndUser);
router.put("/:teamId/members/:userId", memberController.updateMemberRole);
router.delete("/:teamId/members/:userId", memberController.removeMember);
module.exports = router;
