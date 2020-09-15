import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import model from "./model.js";

const USER_DATA = global.app.getPath("userData");
let configPath = path.join(USER_DATA, "mark", "config.json");
let config = {};
if (fs.existsSync(configPath)) {
  let text = fs.readFileSync(configPath, "utf8");
  if (text) {
    config = JSON.parse(text);
  }
}
let ppath = path.join(USER_DATA, "mark", "mark.db");
if (config.dataPath) {
  ppath = path.join(config.dataPath, "mark.db");
}

const db = new Database(ppath, { verbose: console.log });
export { db };
