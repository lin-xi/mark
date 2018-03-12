require("babel-register");

const path = require('path')
const fetch = require('node-fetch')
const logger = require('electron-logger');
const fse = require('fs-extra')

const {
  app,
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  Menu,
  shell,
  globalShortcut
} = require('electron')
const autoUpdater = require('./auto-updater')
const Service = require('./services/index.js').default
const Data = require('./services/data.js').default
let willQuitApp = false;

/**
 * 初始化
 */
function initialize() {
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  app.on('ready', () => {
    appReady()
  })

  app.on('window-all-closed', function() {
    if(process.platform != 'darwin')
      app.quit();
  });

  app.on('activate', () => {
    if (global.win === undefined) {
      createWindow()
    } else {
      global.win.show()
    }
  })

  app.on('before-quit', () => {
    willQuitApp = true;
  })
}

//创建窗口
function createWindow() {
  const windowOptions = {
    width: 1000,
    minWidth: 800,
    height: 600,
    title: app.getName(),
    backgroundColor: '#f0f0f0',
    titleBarStyle: 'hiddenInset'
  }
  let win = new BrowserWindow(windowOptions)
  win.loadURL(path.join('file://', __dirname, '../dist/index.html'))

  const debug = /--debug/.test(process.argv[2])
  if (debug) {
    win.webContents.openDevTools()
    win.maximize()
  }

  win.on('close', function(e){
    if (!willQuitApp) {
      e.preventDefault();
      win.hide();
    } else {
      global.win = undefined
    }
  });

  global.win = win
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return false;

  return app.makeSingleInstance(function () {
    if (global.win) {
      if (global.win.isMinimized()) 
        global.win.restore();
      global.win.focus();
    }
  });
}

/**
 * 初始化全局配置
 */
function globalConfig() {
  //数据目录初始化
  let ppath = path.join(app.getPath("userData"), 'mark')
  if(!fse.ensureDirSync(ppath)) {
    fse.mkdirsSync(ppath)
  }
  //logger设置
  logger.setOutput({file: path.join(ppath, "debug.log")});
  logger.setLevel("info");

  //db文件初始化
  let planPath = path.join(ppath, 'plan.db')
  let notePath = path.join(ppath, 'note.db')
  if (!fse.pathExistsSync(planPath)) {
    fse.outputFileSync(planPath, '', 'utf8')
    fse.outputFileSync(notePath, '', 'utf8')
    logger.info("create db files sucess");
  }
  global.dataPath = ppath
  global.logger = logger
  global.app = app
}

/**
 * 初始化进程通信管道
 */
function initIPC () {
  // db请求
  ipcMain.on('data-rpc', (event, args) => {
    let uuid = args[0]
    let dbname = args[1]
    let command = args[2]
    let params = args.slice(3)
    
    global.daos[dbname][command](...params).then(data => {
      event.sender.send('data-rpc-response', {
        errNo: 0,
        errMsg: '',
        uuid: uuid,
        result: data
      })
    })
  })

  // http请求
  ipcMain.on('data-request', (event, args) => {
    let uuid = args[0]
    let url = args[1]
    let params = args[2]
  
    fetch(url, params).then(res => {
      return res.json();
    }).then((json) => {
      event.sender.send('data-request-response', {
        errNo: 0,
        errMsg: '',
        uuid: uuid,
        result: json
      })
    })
  })
}

/**
 * 初始化DB实例
 */
function initDBInstance() {
  global.daos = {}
  return Promise.all([
    Service.getDB('plan').then(dao => {
      global.daos.plan = dao
    }), 
    Service.getDB('note').then(dao => {
      global.daos.note = dao
    })
  ])
}

/**
 * 初始化菜单
 */
function setMenu() {
  const template = [
    {
      label: 'Mark',
      submenu: [
        {
          label: '偏好设置', 
          accelerator: "Shift+Ctrl+P",
          click() { sendMenuCommand("setting") }
        }
      ]
    },
    {
      label: "编辑",
      submenu: [
          { label: "撤销", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "重做", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "剪切", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "全选", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
          { type: "separator" },
          {
            label: '重新加载',
            accelerator: 'CmdOrCtrl+R',
            click: function(item, focusedWindow) {
              if (global.win)  global.win.reload();
            }
          }
      ]
    },
    {
      label: '数据管理',
      submenu: [
        {
          label: '导出数据', 
          accelerator: "Shift+Ctrl+E",
          click() { Data.exportData() }
        },
        {type: 'separator'},
        {
          label: '导入数据', 
          accelerator: "Shift+Ctrl+I",
          click() { Data.importData() }
        }
      ]
    },
    {
      label: '反馈',
      submenu: [
        {
          label: 'Bug反馈',
          accelerator: "Shift+Ctrl+B",
          click () { shell.openExternal('https://github.com/lin-xi/mark/issues') }
        },
        {
          label: '需求反馈',
          accelerator: "Shift+Ctrl+R",
          click () { shell.openExternal('https://github.com/lin-xi/mark/issues') }
        }
      ]
    },
    {
      label: '关于',
      submenu: [
        {
          label: '关于', 
          accelerator: "Shift+Ctrl+A",
          click() { sendMenuCommand("about") }
        },
        {
          label: '源码', 
          accelerator: "Shift+Ctrl+S",
          click() { shell.openExternal('https://github.com/lin-xi/mark')  }
        },
        {type: 'separator'},
        {
          label: '捐赠',
          accelerator: "Shift+Ctrl+M",
          click() { shell.openExternal('https://github.com/lin-xi/mark') }
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

/**
 * 发送菜单命令
 */
function sendMenuCommand(command) {
  global.win.webContents.send('menu-command', command)
}

/**
 * appReady
 */
function appReady () {
  //autoUpdater.initialize() //自动更新
  //初始化全局配置
  globalConfig()
  //初始化DB实例
  initDBInstance().then(() => {
    //初始化进程通信管道
    initIPC()
    //创建窗口
    createWindow()
    setMenu()
  })
}
initialize();