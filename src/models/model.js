import db from "./db.js";

const DDL = {
  plan: `CREATE TABLE IF NOT EXISTS plan (
      id         INTEGER       PRIMARY KEY AUTOINCREMENT UNIQUE,
      subject    VARCHAR (512) NOT NULL,
      tags       VARCHAR (256),
      content    TEXT,
      user_id    INT,
      created_at DATETIME,
      updated_at DATETIME,
      status     INT (1) 
  );`,
  note: `CREATE TABLE IF NOT EXISTS note (
      id          INTEGER       PRIMARY KEY AUTOINCREMENT UNIQUE,
      subject     VARCHAR (512) NOT NULL,
      content     TEXT,
      book_id     BIGINT,
      category_id BIGINT,
      created_at  DATETIME,
      updated_at  DATETIME,
      user_id     INT
    );`,
  note_book: `CREATE TABLE IF NOT EXISTS note_book (
      id         INTEGER       PRIMARY KEY AUTOINCREMENT UNIQUE,
      name       VARCHAR (256) NOT NULL,
      created_at DATETIME,
      updated_at DATETIME,
      user_id    INT
  );`,
  note_category: `CREATE TABLE note_category (
      id         INTEGER       PRIMARY KEY AUTOINCREMENT UNIQUE,
      name       VARCHAR (128) NOT NULL,
      book_id    BIGINT,
      created_at DATETIME,
      updated_at DATETIME,
      user_id    INT
  );`
};

function initDB() {
  for (let key in DDL) {
    let sql = DDL[key];
    let stm = db.prepare(sql);
    stm.run();
  }
}

function add(table, data) {
  let fields = Object.keys(data);
  let sign = fields.map(item => "@" + item);
  const sql = `INSERT INTO ${table} (${fields.join(",")}) VALUES (${sign.join(
    ","
  )})`;
  let statement = db.prepare(sql);
  let record = statement.run(data);
  console.log("🖨 :", sql, data);
  return record;
}

function update(table, where, data) {
  let fieldStm = [];
  for (let field in data) {
    let val = wrapValue(data[field]);
    fieldStm.push(`${field}=${val}`);
  }
  let whereStm = [];
  for (let field in where) {
    let val = wrapValue(where[field]);
    whereStm.push(`${field}=${val}`);
  }
  let sql = `UPDATE ${table} SET ${fieldStm.join(",")} WHERE ${whereStm.join(
    " and "
  )})`;
  let statement = db.prepare(sql);
  statement.run();
  console.log("🖨 :", sql);
}

function remove(table, where) {
  let whereStm = [];
  for (let field in where) {
    let val = wrapValue(where[field]);
    whereStm.push(`${field}=${val}`);
  }
  let sql = `DELETE from ${table} WHERE ${whereStm.join(" and ")})`;
  let statement = db.prepare(sql);
  statement.run();
  console.log("🖨 :", sql);
}

function query(table, where = {}, sort = {}) {
  let sql = prepareQuery(table, where, sort);
  let statement = db.prepare(sql);
  const records = statement.all();
  console.log("🖨 :", sql);
  return records;
}

function queryOne(table, where = {}, sort = {}) {
  let sql = prepareQuery(table, where, sort);
  let statement = db.prepare(sql);
  const record = statement.get();
  console.log("🖨 :", sql);
  return record;
}

function execute(sql) {
  let statement = db.prepare(sql);
  const records = statement.run();
  console.log("🖨 :", sql);
  return records;
}

function prepareQuery(table, where, sort) {
  let whereStm = [];
  for (let field in where) {
    let val = wrapValue(where[field]);
    whereStm.push(`${field}=${val}`);
  }
  let sortStm = [];
  for (let field in sort) {
    whereStm.push(`${field} ${sort[field]}`);
  }
  let order = "";
  if (sortStm.length > 0) {
    order = ` ORDER BY ${sortStm.join(",")}`;
  }
  let condition = "";
  if (whereStm.length > 0) {
    condition = ` WHERE ${whereStm.join(" and ")}`;
  }
  let sql = `SELECT * from ${table} ${condition} ${order}`;
  console.log(sql);
  return sql;
}

function wrapValue(val) {
  switch (typeof val) {
    case "number":
    case "boolean":
      break;
    default:
      val = `'${val}'`;
      break;
  }
  return val;
}

export default { initDB, add, update, remove, query, queryOne };
