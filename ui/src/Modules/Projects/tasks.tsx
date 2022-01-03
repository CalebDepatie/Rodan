import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useFetch } from '../../Hooks';
import g from 'guark';

import { Button, InputText, Dropdown } from '../../Components';

import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
//import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { TreeSelect } from 'primereact/treeselect';

import { statusItemTemplate, statusValueTemplate } from '../../Helpers';

function Tasks(props:any) {
  const [tasksFetch, tasksSignal]     = useFetch("get_tasks");
  const [statusFetch, statusSignal]   = useFetch("get_statuses");
  const [ updateFetch, updateSignal ] = useFetch("update_task");
  const [ createFetch, createSignal ] = useFetch("create_task");
  const [ boardHeadFetch, headSignal ]= useFetch("get_board_heads");
  const [ fragFetch, fragSignal ]     = useFetch("get_board");

  const [ activites, setActivities ]   = useState<any[]>([]);
  const [ boardHeads, setBoardHeads ]  = useState<any[]>([]);
  const [ statuses, setStatuses ] = useState([]);
  const [ tasks, setTasks ] = useState<any[]>([]);
  const [ show, setShow ]   = useState<boolean>(false);
  const [ form, setForm ]   = useState<{[key: string]: any}>({});
  const [ frags, setFrags ] = useState<any[]>([]);

  const toast = useRef<any>(null);

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  const refresh = () => {
    // signal all fetch commands
    tasksSignal({});
    headSignal({});
    statusSignal({section:"task"});
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (statusFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not load statuses', detail:statusFetch!.error, life:3000});
    } else {
      const status = statusFetch?.body ?? [];
      setStatuses(status);
    }
  }, [statusFetch]);

  useEffect(() => {
    if (tasksFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not load Tasks', detail:tasksFetch!.error, life:3000});
    } else {
      const tasks = tasksFetch?.body ?? [];
      setTasks(tasks);
    }
  }, [tasksFetch]);

  useEffect(() => {
    if (boardHeadFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not load board heads', detail:boardHeadFetch!.error, life:3000});
    } else {
      const heads = boardHeadFetch?.body ?? [];
      setBoardHeads(heads.filter((head:any) => head.state !== 0 && head.state !== 3));
    }
  }, [boardHeadFetch]);

  useEffect(() => {
    if (fragFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not load fragnets', detail:fragFetch!.error, life:3000});
    } else {
      const board_frags = fragFetch?.body ?? [];

      const create_children = (key:string, parent: string) => {
        return board_frags.filter((itm:any) => itm.parent === parent && !(itm.status === 8 || itm.status === 9)).map((itm:any) => {
          return {
            key: itm.id,
            label:itm.title,
            data:itm.id,
            board_id: itm.board_id,
            children: create_children(key + '~' + itm.id, itm.id),
          };
        });
      };

      setFrags([...frags, ...board_frags.filter((itm:any) => itm.parent === '' && !(itm.status === 8 || itm.status === 9)).map((itm:any) => {
        return {
          key: itm.id,
          label:itm.title,
          data:itm.id,
          board_id: itm.board_id,
          children: create_children(itm.board_id + '~' + itm.id, itm.id),
        };
      })]);
    }
  }, [fragFetch]);

  useEffect(() => {
    if (updateFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not update value', detail:updateFetch!.error, life:3000});
    }
  }, [updateFetch]);

  useEffect(() => {
    if (createFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not create task', detail:createFetch!.error, life:3000});
    } else if (createFetch?.body) {
      toast.current.show({severity: 'success', summary: 'Task Created', detail: ''});
    };
  }, [createFetch]);

  useEffect(() => {
    boardHeads.forEach((head:any, idx:number) => {
      setTimeout(()=>fragSignal({board: head.id}), 250*idx);
    });
  }, [boardHeads]);

  useEffect(() => {
    setActivities(boardHeads.map((head:any) => {
      return {
        label: head.title,
        key: head.id,
        data: head.id,
        children: frags.filter((frag:any) => frag.board_id === head.id) ?? [],
      }
    }));
  }, [frags]);

  const formText = (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.target.value})
    };
  };

  const formDropdown = (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.target.value})
    };
  };

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
    <Toast ref={toast}/>
    <DataTable header={header} value={tasks} editMode="cell" style={{paddingBottom:"30px"}} >
      <Column field="title" header="Title" />
      <Column field="descrip" header="Description" />
      <Column field="status" header="Status" body={statusFormat} editor={statusEditor} style={{width:"100px"}} />
      <Column field="initiative" header="Initiative" />
      <Column field="activity" header="Fragnet" />
    </DataTable>

    <Dialog header="Create a Task" visible={show} onHide={handleClose} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          createSignal({body: JSON.stringify(form)});
          setTasks([...tasks, form]);
        }} />
      </>
    )}>

    <div className='r-form'>
      <div className="r-field r-col-6">
        <label htmlFor="name">Name</label>
        <InputText id="name" type="text" {...formText('title')}/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="de">Description</label>
        <InputText id="de" type="text" {...formText('description')}/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="par">Activity</label>
        <TreeSelect options={activites ?? []} id="par" {...formDropdown('activity')}/>
      </div>
    </div>

    </Dialog>
    </>
  );
};

export default Tasks;
