import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('tasks-get', async (e, req) => {
  try {
    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/get_tasks`);
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

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/update_task`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})

ipcMain.handle('tasks-create', async (e, req) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }

    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/create_task`, options);

    return {}

  } catch (err) {
    return {
      error: err
    }
  }
})

ipcMain.handle('tasks-form-boards', async (e, req) => {
  try {
    const heads_res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/get_board_heads`);
    const heads_json = await heads_res.json()

    const heads = heads_json.filter((head:any) => head.state !== 0 && head.state !== 3)

    let boards = [];

    const boards_promises = heads.map(async (head:any) => {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({board: head.id})
      }

      const frags_res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/get_board`, options);
      const frags_json = await frags_res.json()

      const create_children = (key:string, parent: string) => {
        return frags_json.filter((itm:any) => itm.parent === parent && !(itm.status === 8 || itm.status === 9)).map((itm:any) => {
          return {
            key: itm.id,
            label:itm.title,
            data:itm.id,
            board_id: itm.board_id,
            children: create_children(key + '~' + itm.id, itm.id),
          };
        });
      };

      const board_frags = frags_json.filter((itm:any) => itm.parent === '' && !(itm.status === 8 || itm.status === 9)).map((itm:any) => {
        return {
          key: itm.id,
          label:itm.title,
          data:itm.id,
          board_id: itm.board_id,
          children: create_children(itm.board_id + '~' + itm.id, itm.id),
        };
      })

      const new_board = {
        label: head.title,
        key: head.id,
        data: head.id,
        children: board_frags
      }

      boards = [...boards, new_board]

      return {};
    });

    await Promise.all(boards_promises)

    return {
      body: boards
    }

  } catch (err) {
    return {
      error: err,
      body: []
    }
  }
})
