import { ipcMain, app, remote } from 'electron'
import { join } from 'path'
import { readFile, writeFile, rm } from 'node:fs/promises'

const userData = (app || remote.app).getPath('userData')

const parseFile = async (path) => {
  try {
    return JSON.parse(await readFile(path))
  } catch (error) {
    // if it's blank
    return {}
  }
}

ipcMain.handle("file-save", async (e, req) => {
  const userDataPath = join(userData, req.key + ".json")
  const data = await parseFile(userDataPath)

  await writeFile(userDataPath, JSON.stringify(req.value))
})

ipcMain.handle("file-get", async (e, req) => {
  const userDataPath = join(userData, req.key + ".json")

  return await parseFile(userDataPath)
})

ipcMain.handle("file-del", async (e, req) => {
  const userDataPath = join(userData, req.key + ".json")

  await rm(userDataPath)
})
