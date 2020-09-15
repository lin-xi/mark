import BaseModel from "./BaseModel.js";

class NoteBook extends BaseModel {
  constructor() {
    super("note_book");
  }
}

export default new NoteBook();
