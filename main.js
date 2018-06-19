const { BrowserWindow, app } = require('electron')
const isDev = require('electron-is-dev')

app.on('ready', async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.webContents.openDevTools()

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log('granted permission:', permission)
    // eslint-disable-next-line standard/no-callback-literal
    callback(true)
  })

  const url = isDev
    ? 'http://localhost:3000/'
    : `file://${__dirname}/build/index.html`

  mainWindow.loadURL(url)
})

app.on('window-all-closed', app.quit)
