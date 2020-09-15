import plan from "../models/Plan.js";

export default class PlanService {
  constructor() {}

  queryPlan(where, sort = { created_at: "DESC" }) {
    return note.query(where, sort);
  }

  addPlan(data) {
    return note.add(data);
  }

  updatePlan(where, data) {
    return note.update(where, data);
  }

  removePlan(where) {
    return note.remove(where);
  }
}
