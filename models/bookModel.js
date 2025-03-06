const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  date: {
    type: Date,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
  },
});

const books = mongoose.model('books', bookSchema);
module.exports = books
