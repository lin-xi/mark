
import moment from 'moment'
import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
const {
  Tray,
  dialog,
  shell
} = require('electron')

export default {
  exportData () {
    let name = moment().format('YYYY-MM-DD_HH_mm_ss') + '_data.m'
    dialog.showSaveDialog(global.win, {
      title: '请选择保存位置',
      defaultPath: '~/Download/' + name
    }, (filename, bookmark) => {
      if (filename) {
        let zip = new AdmZip()
        zip.addLocalFile(global.dataPath + '/plan.db')
        zip.addLocalFile(global.dataPath + '/note.db')
        zip.writeZip(filename)

        shell.openItem(path.dirname(filename))

        dialog.showMessageBox(global.win, {
          type: 'info',
          title: 'Mark',
          message: '导出数据成功'
        })
      }
    })
  },

  importData () {
    dialog.showMessageBox(global.win, {
      type: 'question',
      title: 'Mark',
      message: '导入后，当前全部数据会被覆盖，你确定要覆盖相当数据吗？，',
      buttons: ['继续导入', '取消']
    }, (response, checkboxChecked) => {
      console.log('response>>>:', response)
      if (response == 0) {
        dialog.showOpenDialog(global.win, {
          title: '请选择数据文件',
          defaultPath: '~/Download/',
          filters: [
            {name: 'Mark Data File', extensions: ['m']}
          ]
        }, (filePaths, bookmark) => {
          if (filePaths.length == 0) return

          let zip = new AdmZip(filePaths[0])
          var zipEntries = zip.getEntries()

          zipEntries.forEach(function (zipEntry) {
            // console.log(zipEntry.entryName)
            if (zipEntry.entryName == 'plan.db' || zipEntry.entryName == 'note.db') {
              // console.log(zipEntry.getData().toString('utf8'))
              fs.writeFileSync(global.dataPath + '/' + zipEntry.entryName, zipEntry.getData().toString('utf8'), 'utf8')
            }
          })

          dialog.showMessageBox(global.win, {
            type: 'info',
            title: 'Mark',
            message: '导入数据成功'
          })
        })
      }
    })
  }
}
