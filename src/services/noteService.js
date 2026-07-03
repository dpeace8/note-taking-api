const noteRepository = require("../repositories/noteRepository");

function getAllNotes() {
  return noteRepository.findAll();
}

function getNoteById(id) {
  const note = noteRepository.findById(id);

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  return note;
}

function createNote(data) {
  if (!data.user_id || !data.title || !data.content) {
    const error = new Error("User, title and content are required");
    error.statusCode = 400;
    throw error;
  }

  return noteRepository.create({
    user_id: data.user_id,
    title: data.title,
    content: data.content
  });
}

function updateNote(id, data) {
  const existingNote = noteRepository.findById(id);

  if (!existingNote) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (!data.title || !data.content) {
    const error = new Error("Title and content are required");
    error.statusCode = 400;
    throw error;
  }

  return noteRepository.update(id, {
    title: data.title,
    content: data.content
  });
}

function deleteNote(id) {
  const existingNote = noteRepository.findById(id);

  if (!existingNote) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  noteRepository.remove(id);
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
