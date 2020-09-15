import model from "./model.js";

class BaseModel {
  constructor(table) {
    this.table = table;
  }

  query(where, sort = { created_at: "DESC" }) {
    return model.query(this.table, where, sort);
  }

  queryOne(where, sort = { created_at: "DESC" }) {
    return model.queryOne(this.table, where, sort);
  }

  add(where, sort = { created_at: "DESC" }) {
    return model.query(this.table, where, sort);
  }

  update(data) {
    return model.add(this.table, data);
  }

  remove(data) {
    return model.add(this.table, data);
  }
}
