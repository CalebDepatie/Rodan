import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('boards-get', async (e, req) => {
  try {
    const heads_res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/get_board_heads`);
    const heads_json = await heads_res.json()

    const grouped_heads = [
      {
        label:"Template", icon:"fa-bookmark",
        items: heads_json.filter((head:any) => head.state === 0)
      },
      {
        label:"Draft", icon:"fa-edit",
        items: heads_json.filter((head:any) => head.state === 1)
      },
      {
        label:"Active", icon:"fa-briefcase",
        items: heads_json.filter((head:any) => head.state === 2)
      },
      {
        label:"Complete", icon:"fa-check-circle",
        items: heads_json.filter((head:any) => head.state === 3)
      },
    ];

    const proj_res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/get_projects`);
    const proj_json = await proj_res.json();

    const valid_inis = proj_json.filter((itm:any) => itm.parent !== 0) // filter for initiatives
                        .filter((itm:any) => !heads_json.some((head:any) => head.initiative === itm.id)) // filter out inis with a board
                        .filter((itm:any) => itm.status !== 4); // filter out completed projects

    return {
      body: [
        grouped_heads,
        valid_inis
      ]
    }

  } catch (err) {
    return {
      body: [],
      error: err
    }
  }
});

ipcMain.handle('boards-frags', async (e, req) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const frags_res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/get_board`, options);
    const frags_json = await frags_res.json()

    const create_children = (key: string, parent: string) => {
      return frags_json.filter((itm:any) => itm.parent === parent).map((itm:any) => {
        return {
          key: key + '~' + itm.id,
          data: itm,
          children: create_children(key + '~' + itm.id, itm.id),
        };
      });
    };

    const board_frags = frags_json.filter((itm:any) => itm.parent === '').map((itm:any) => {
      return {
        key: itm.id,
        data: itm,
        children: create_children(itm.id, itm.id),
      };
    })

    return {
      body: board_frags
    }

  } catch (err) {
    return {
      body: [],
      error: err
    }
  }
})

ipcMain.handle("boards-update", async (e, req) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/update_board`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})

ipcMain.handle("boards-frags-update", async (e, req) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/update_fragnet`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})

ipcMain.handle("boards-create", async (e, req) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/create_board`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})

ipcMain.handle("boards-frags-create", async (e, req) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/create_fragnet`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})
