import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle("docs-get", async (e, req) => {
    try {
      const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/get_controlled_docs`);
      const json = await res.json();
  
      return {
        body: json
      };
  
    } catch (err) {
      return {
        body: [],
        error: err
      }
    }
})

ipcMain.handle("docs-update-content", async (e, req) => {
    try {

        const options = {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        }

        const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/update_doc_working`, 
            options);

        return {}
    
    } catch (err) {
        return {
            error: err
        }
    }
})

ipcMain.handle("docs-update-rev", async (e, req) => {
    try {

        const options = {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        }

        const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/update_doc_rev`, 
            options);

        return {}
    
    } catch (err) {
        return {
            error: err
        }
    }
})