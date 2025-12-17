const express = require("express");
const {
  getNotes,
  createNote,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();

// GET all notes
router.get("/", getNotes);

// POST create a new note
router.post("/", createNote);

// DELETE a note by ID
router.delete("/:id", deleteNote);

module.exports = router;

