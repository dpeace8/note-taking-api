const noteRepository = require("../repositories/noteRepository");
const memberRepository = require("../repositories/memberRepository");

function getAllNotes(options = {}) {
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 10;
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const offset = (page - 1) * limit;
  const notes = noteRepository.findAll({ limit, offset });

  return {
    page,
    limit,
    data: notes
  };
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
  if (!data.user_id || !data.team_id || !data.title || !data.content) {
    const error = new Error("User, team, title and content are required");
    error.statusCode = 400;
    throw error;
  }

  const member = memberRepository.findByTeamAndUser(data.team_id, data.user_id);

  if (!member) {
    const error = new Error("User is not a member of this team");
    error.statusCode = 403;
    throw error;
  }

  return noteRepository.create({
    user_id: data.user_id,
    team_id: data.team_id,
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
