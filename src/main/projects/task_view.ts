import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('tasks-get', async (e, req) => {
  try {
    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/get_tasks`);
    const json = await res.json();

    return {
      body: json
    }

  } catch (err) {
    return {
      body: [],
      error: err
    }
  }
});

ipcMain.handle('tasks-update', async (e, req) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/update_task`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})
