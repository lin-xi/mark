import BaseModel from "./BaseModel.js";

class Note extends BaseModel {
  constructor() {
    super("note");
  }
}

export default new Note();
