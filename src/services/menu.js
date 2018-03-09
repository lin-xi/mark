export default class MenuDao {
  constructor(db) {
    this.db = db
  }

  query() {
    this.db.find(doc, function (err, newDoc) { // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
    });
  }

  insert(db, doc) {
    this.db.insert(doc, function (err, newDoc) { // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
    });
  }

  update(db) {
    this.db.update(doc, function (err, newDoc) { // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
    });
  }

  remove(db) {
    this.db.remove(doc, function (err, newDoc) { // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
    })
  }
}