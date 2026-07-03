const express = require("express");
const userController = require("../controllers/userController");
const memberController = require("../controllers/memberController");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:userId/teams", memberController.getTeamsByUser);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
