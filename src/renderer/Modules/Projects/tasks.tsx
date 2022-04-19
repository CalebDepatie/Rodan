import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { ipcRenderer } from 'electron';
import { useFetch } from '../../Hooks';

import { Button, InputText, Dropdown } from '../../Components';
import TaskForm from './taskForm';

import { toast } from 'react-toastify';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { statusItemTemplate, statusValueTemplate } from '../../Helpers';

function Tasks(props:any) {
  const [tasksFetch, tasksSignal]     = useFetch("get_tasks");
  const [ updateFetch, updateSignal ] = useFetch("update_task");

  const [ statuses, setStatuses ] = useState([]);
  const [ tasks, setTasks ] = useState<any[]>([]);
  const [ show, setShow ]   = useState<boolean>(false);

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  const refresh = () => {
    // signal all fetch commands
    tasksSignal({});
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

  useEffect(() => {
    if (statusFetch?.error) {
      toast.error('Could not load statuses, ' + statusFetch!.error, {});
    } else {
      const status = statusFetch?.body ?? [];
      setStatuses(status);
    }
  }, [statusFetch]);

  useEffect(() => {
    if (tasksFetch?.error) {
      toast.error('Could not load Tasks, ' + tasksFetch!.error, {});
    } else {
      const tasks = tasksFetch?.body ?? [];
      setTasks(tasks.filter((el:any) => el.status != 13));
    }
  }, [tasksFetch]);

  useEffect(() => {
    if (updateFetch?.error) {
      toast.error('Could not update value, ' + updateFetch!.error, {});
    }
  }, [updateFetch]);

  const onEditorValueChange = (props: any, field:string, value: string, id: string) => {
    updateSignal({body: JSON.stringify({updateCol: field, updateVal: value.toString(), taskID: id})});
    // update table data
    let newData = JSON.parse(JSON.stringify(tasks)); // deep copy
    let editedNode = newData.find((row:any) => row.id === id);
    editedNode[field] = value;
    setTasks(newData);
  };

  const statusEditor = (props: any) => {
    const data = props.rowData.status;
    const id   = props.rowData.id;
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

  const header = (
    <>
      <Button icon="fa fa-plus" label="Add Task" onClick={handleShow} />
    </>
  );

  return (
    <>
    <DataTable header={header} value={tasks} editMode="cell" style={{paddingBottom:"30px"}} >
      <Column field="title" header="Title" />
      <Column field="descrip" header="Description" />
      <Column field="status" header="Status" body={statusFormat} editor={statusEditor} style={{width:"100px"}} />
      <Column field="initiative" header="Initiative" />
      <Column field="activity" header="Fragnet" />
    </DataTable>

    <TaskForm show={show} handleClose={handleClose} onSubmit={(f:any)=>setTasks([...tasks, f])} />
    </>
  );
};

export default Tasks;
