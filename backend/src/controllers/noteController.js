const Note = require("../models/Note");

async function getNotes(req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ message: "Unable to fetch notes" });
  }
}

async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "title and content are required" });
    }

    const note = await Note.create({ title, content });
    res.status(201).json(note);
  } catch (err) {
    console.error("Failed to create note:", err);
    res.status(500).json({ message: "Unable to create note" });
  }
}

async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete note:", err);
    res.status(500).json({ message: "Unable to delete note" });
  }
}

module.exports = { getNotes, createNote, deleteNote };

