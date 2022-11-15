import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { ipcRenderer } from 'electron';

import { Button, InputText, Dropdown, Table } from '../../Components';
import TaskForm from './taskForm';

import { toast } from 'react-toastify';

import { statusItemTemplate, statusValueTemplate } from '../../Helpers';

function Tasks(props:any) {
  const [ statuses, setStatuses ] = useState([]);
  const [ tasks, setTasks ] = useState<any[]>([]);
  const [ show, setShow ]   = useState<boolean>(false);

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  const refresh = async () => {
    // signal all fetch commands
    const res = await ipcRenderer.invoke('tasks-get', {});

    if (res.error != undefined) {
      toast.error('Could not load tasks: ' + res.error)
    }

    setTasks(res.body.filter((el:any) => el.status != 13));
  };

  useEffect(() => {
    refresh();

    const fn = async () => {
      const res = await ipcRenderer.invoke('statuses-get', {section:"task"});

      if (res.error != undefined) {
        toast.error('Could not load statuses: ' + res.error)
      }

      setStatuses(res.body);
    };
    fn();
  }, []);

  const onEditorValueChange = async (props: any, field:string, value: string, id: string) => {
    const res = await ipcRenderer.invoke('tasks-update', {updateCol: field, updateVal: value.toString(), taskID: id});
    if (res.error != undefined) {
      toast.error("Could not update task: " + res.error)
      return
    }

    // update table data
    setTasks(curData => {
      let editedNode = curData.find((row:any) => row.id === id);
      editedNode[field] = value;

      return JSON.parse(JSON.stringify(curData))
    });
  };

  const statusEditor = (props: any) => {
    const data = props.status;
    const id   = props.id;
    return (
      <Dropdown value={data} onChange={(e) => onEditorValueChange(props, 'status', e.target.value, id)}
                options={statuses} optionValue='id' optionLabel='name'
                />
    );
  };

  const statusFormat = (row: any) => {
    const status = statuses.filter((i:any) => parseInt(i.id) === parseInt(row.status))[0]?.["name"];
    return <div className={`status-${row.status}`}>{status}</div>
  };

  const onSubmit = (f: any) => {
    refresh()
  };

  const header = (
    <>
      <Button icon="fa fa-plus" label="Add Task" onClick={handleShow} />
    </>
  );

  const columns = [
  {
    field: "title",
    header: "Title",
  },
  {
    field: "descrip",
    header: "Description",
  },
  {
    field: "status",
    header: "Status",
    body: statusFormat,
    editor: statusEditor,
  },
  {
    field: "initiative",
    header: "Initiative",
  },
  {
    field: "activity",
    header: "Fragnet"
  }
  ];

  return (
    <>
    <Table pk="id" columns={columns} header={header}
      data={tasks} style={{paddingBottom:"30px"}} />

    <TaskForm show={show} handleClose={handleClose} onSubmit={onSubmit} />
    </>
  );
};

export default Tasks;
