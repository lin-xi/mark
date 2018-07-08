const {
  ipcRenderer
} = window.require('electron')
const uuidv4 = require('uuid/v4');

let events = {}

ipcRenderer.on('data-rpc-response', (event, result) => {
  let uuid = result.uuid;
  if (events[uuid]) {
    events[uuid](result)
  }
})

ipcRenderer.on('data-request-response', (event, result) => {
  let uuid = result.uuid;
  if (events[uuid]) {
    events[uuid](result)
  }
})

export default {
  execute(...args) {
    let uuid = uuidv4()
    return new Promise(resolve => {
      events[uuid] = resolve
      ipcRenderer.send('data-rpc', [uuid, ...args])
    })
  },

  request(...args) {
    let uuid = uuidv4()
    return new Promise(resolve => {
      events[uuid] = resolve
      ipcRenderer.send('data-request', [uuid, ...args])
    })
  }
}