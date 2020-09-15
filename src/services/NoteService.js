import note from "../models/Note.js";
import noteBook from "../models/NoteBook.js";
import noteCategory from "../models/NoteCategory.js";

export default class NoteService {
  constructor() {}

  queryNote(where, sort = { created_at: "DESC" }) {
    return note.query(where, sort);
  }

  queryBook(where, sort = { created_at: "DESC" }) {
    return noteBook.query(where, sort);
  }

  queryCategory(where, sort = { created_at: "DESC" }) {
    return noteCategory.query(where, sort);
  }

  addNote(data) {
    return note.add(data);
  }

  addBook(data) {
    return noteBook.add(data);
  }

  addCategory(data) {
    return noteCategory.add(this.table, data);
  }

  updateNote(where, data) {
    return note.update(where, data);
  }

  updateBook(where, data) {
    return noteBook.update(where, data);
  }

  updateCategory(where, data) {
    return noteCategory.update(where, data);
  }

  removeNote(where) {
    return note.remove(where);
  }

  removeBook(where) {
    return noteBook.remove(where);
  }

  removeCategory(where) {
    return noteCategory.remove(where);
  }
}
