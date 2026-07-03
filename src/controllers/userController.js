const userService = require("../services/userService");

function getAllUsers(req, res, next) {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

function getUserById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = userService.getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

function createUser(req, res, next) {
  try {
    const user = userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = userService.updateUser(id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};