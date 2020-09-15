import BaseModel from "./BaseModel.js";

class NoteCategory extends BaseModel {
  constructor() {
    super("note_category");
  }
}

export default new NoteCategory();
