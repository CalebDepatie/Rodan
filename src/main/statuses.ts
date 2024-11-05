import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('statuses-get', async (e, req) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.GATEWAY}:${process.env.PORT}/Gojira/get_statuses`, options);

    const json = await res.json();

    return {
        body: json
    };
  } catch (err) {
    return {
      error: err,
      body: [],
    };
  }

});
