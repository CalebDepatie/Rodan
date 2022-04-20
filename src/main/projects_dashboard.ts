import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('projects-get', async (e, req) => {
  try {
    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/get_projects`);
    const json = await res.json();

    const initiatives = json.filter((itm:any) => itm.parent !== 0);
    const projects    = json.filter((itm:any) => itm.parent === 0);

    const ini = initiatives.map((itm: any) => {
      return {
        key: itm.parent + '-' + itm.id,
        data: itm,
        children: null,
      };
    });

    const projects_tree = projects.map((proj: any) => {
      return {
        key: proj.id.toString(),
        data: proj,
        children: ini.filter((i: any) => i.data.parent === proj.id),
      }
    });

    return {
      body: [projects, initiatives, projects_tree]
    }
  } catch (err) {
    return {
      body: [[], [], []],
      error: err
    }
  }
});

ipcMain.handle('projects-update', async (e, req) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/update_project`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
});

ipcMain.handle('projects-create', async (e, req) => {
  try {

    if (req.parent == undefined) {
      req.parent = 0;
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/create_project`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
});
