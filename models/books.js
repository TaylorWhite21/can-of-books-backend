'use strict'

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:{type: String, required: true},
  description: {type: String},
  status: {type: String},
  email: {type: String},
});

const BookModel = mongoose.model('books', bookSchema);

module.exports = BookModel;
