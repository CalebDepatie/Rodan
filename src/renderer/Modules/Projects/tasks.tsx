import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import { Button, Dropdown, Table, Status } from '../../Components'
import { useCache } from "../../Hooks"

import TaskForm from './taskForm'

import { toast } from 'react-toastify'


function Tasks(props:any) {
  const [ statuses, setStatuses ] = useState([])
  const [ tasks, setTasks ] = useState<any[]>([])
  const [ show, setShow ]   = useState<boolean>(false)

  const [ tasks_cache, tasks_signal ] = useCache('tasks-get')
  const [ status_cache, status_signal ] = useCache('statuses-get', {section:"task"})

  const handleShow  = () => setShow(true)
  const handleClose = () => setShow(false)

  const refresh = () => {
    tasks_signal()
  }

  useEffect(() => {
    if (tasks_cache.error != undefined) {
      toast.error('Could not load tasks: ' + tasks_cache.error.message)
    }
    if (tasks_cache.body != undefined) {
      setTasks(tasks_cache.body.filter((el:any) => el.status != 13))
    }
  }, [tasks_cache])

  useEffect(() => {
    if (status_cache.error != undefined) {
      toast.error('Could not load statuses: ' + status_cache.error.message)
    }

    if (status_cache.body != undefined) {
      setStatuses(status_cache.body);
    }
  }, [status_cache])

  const onEditorValueChange = async (props: any, field:string, value: string, id: string) => {
    const res = await ipcRenderer.invoke('tasks-update', {updateCol: field, updateVal: value.toString(), taskID: id});
    if (res.error != undefined) {
      toast.error("Could not update task: " + res.error.message)
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
    const status = statuses.filter((i:any) => parseInt(i.id) === parseInt(row.status))[0] ?? {};
    return <Status {...status} />
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
