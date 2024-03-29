'use strict'

import { app, BrowserWindow, session, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import dotenv from "dotenv"
import { mkdirSync } from 'node:fs'

import {openSSH, closeSSH} from "./home"

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1360,
    height: 800,
    webPreferences: {
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  if (isDevelopment) {
    window.loadURL( `http://localhost:${ 8182 }/index.html` )
    window.webContents.openDevTools()
  } else {
    window.loadURL(formatUrl({
    	pathname: path.join(__dirname, 'index.html'),
    	protocol: 'file:',
    	slashes: true,
    }));
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  closeSSH();
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
  dotenv.config();

  // create directories for storage in appdata
  const userData = app.getPath('userData')
  mkdirSync(path.join(userData, "FileStorage"), { recursive: true })

  // setup content security policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'self\'; style-src \'unsafe-inline\'; script-src  \'self\' \'unsafe-inline\'']
      }
    })
  });
})

ipcMain.handle("ssh-open", async (e, req) => {
  const res = await openSSH(req.password)
  return res
})

// loading event handlers
import "./statuses"
import "./projects"
import "./pages"
import "./docs"
import "./finances"
import "./fileStorage"
