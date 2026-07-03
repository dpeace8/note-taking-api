const userRepository = require("../repositories/userRepository");

function getAllUsers() {
  return userRepository.findAll();
}

function getUserById(id) {
  const user = userRepository.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

function createUser(data) {
  if (!data.name || !data.email) {
    const error = new Error("Name and email are required");
    error.statusCode = 400;
    throw error;
  }

  return userRepository.create({
    name: data.name,
    email: data.email
  });
}

function updateUser(id, data) {
  const existingUser = userRepository.findById(id);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!data.name || !data.email) {
    const error = new Error("Name and email are required");
    error.statusCode = 400;
    throw error;
  }

  return userRepository.update(id, {
    name: data.name,
    email: data.email
  });
}

function deleteUser(id) {
  const existingUser = userRepository.findById(id);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return userRepository.remove(id);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};