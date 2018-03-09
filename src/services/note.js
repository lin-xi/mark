export default class NoteDao {
  constructor(db) {
    this.db = db
  }

  query(doc, sort = {createTime: 1}) {
    return new Promise(resolve => {
      this.db.find(doc).sort(sort).exec((err, result) => {
        if (err) {
          console.error(err)
        }
        resolve(result)
      });
    })
  }

  add(doc) {
    return new Promise(resolve => {
      this.db.insert(doc, (err, newDoc) => {
        if (err) {
          console.error(err)
        }
        resolve(newDoc)
      });
    })
  }

  update(doc, newDoc) {
    return new Promise(resolve => {
      this.db.update(doc, {
        $set: newDoc
      }, {
        multi: true
      }, (err, numReplaced) => {
        if (err) {
          console.error(err)
        }
        resolve(numReplaced)
      });
    })
  }

  remove(doc) {
    return new Promise(resolve => {
      this.db.remove(doc, (err, newDoc) => {
        if (err) {
          console.error(err)
        }
        resolve(newDoc)
      })
    })
  }
}