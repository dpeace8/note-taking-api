const noteService = require("../services/noteService");

function getAllNotes(req, res, next) {
  try {
    const notes = noteService.getAllNotes();
    res.json(notes);
  } catch (error) {
    next(error);
  }
}

function getNoteById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const note = noteService.getNoteById(id);
    res.json(note);
  } catch (error) {
    next(error);
  }
}

function createNote(req, res, next) {
  try {
    const note = noteService.createNote(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

function updateNote(req, res, next) {
  try {
    const id = Number(req.params.id);
    const note = noteService.updateNote(id, req.body);
    res.json(note);
  } catch (error) {
    next(error);
  }
}

function deleteNote(req, res, next) {
  try {
    const id = Number(req.params.id);
    noteService.deleteNote(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};