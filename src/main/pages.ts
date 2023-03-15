import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle("pages-get", async (e, req) => {
  try {
    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/get_pages`);
    const json = await res.json();

    const create_children = (key: string, parent: string) => {
      return json.filter((itm:any) => itm.parent === parent).map((itm:any) => {
        return {
          key: key + '~' + itm.id,
          icon: itm.icon,
          label: itm.name,
          data: itm,
          children: create_children(key + '~' + itm.id, itm.id),
        };
      });
    };

    const nodes = json.filter((itm:any) => itm.parent === '').map((itm:any) => {
      return {
        key: itm.id,
        icon: itm.icon,
        label: itm.name,
        data: itm,
        children: create_children(itm.id, itm.id),
      };
    })

    return {
      body: nodes
    };

  } catch (err) {
    return {
      body: [],
      error: err
    }
  }
})

ipcMain.handle("pages-update", async (e, req) => {
  try {

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/update_page`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})

ipcMain.handle("pages-create", async (e, req) => {
  try {

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/create_page`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})
