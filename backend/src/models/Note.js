const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Note", noteSchema);

