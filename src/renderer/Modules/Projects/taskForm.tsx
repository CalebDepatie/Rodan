import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { ipcRenderer } from 'electron';

import { Button, InputText, Dropdown } from '../../Components';

import { toast } from 'react-toastify';

import { Dialog } from 'primereact/dialog';
import { TreeSelect } from 'primereact/treeselect';

function TaskForm(props:{show:boolean, handleClose:()=>void, onSubmit?:(f:any)=>void}) {
  const [ form, setForm ] = useState<{[key: string]: any}>({});
  const [ activites, setActivities ] = useState<any[]>([]);

  useEffect(() => {
    const fn = async () => {
      const res = await ipcRenderer.invoke("tasks-form-boards", {})
      if (res.error !== undefined) {
        toast.error('Could not load boards: ', res.error)
      }

      setActivities(res.body);
    }
    fn();
  }, [])

  const formField = (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.target.value})
    };
  };

  return (
    <>
    <Dialog header="Create a Task" visible={props.show} onHide={props.handleClose} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          ipcRenderer.invoke('tasks-create', form)
            .then(res => {
              if (res.error != undefined) {
                toast.error("Could not create task: " + res.error)

                return
              }

              props?.onSubmit?.(form);
              toast.success("Created Task")
            });
        }} />
      </>
    )}>

    <div className='r-form'>
      <div className="r-field r-col-6">
        <label htmlFor="name">Name</label>
        <InputText id="name" type="text" {...formField('title')} />
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="de">Description</label>
        <InputText id="de" type="text" {...formField('description')} />
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="par">Activity</label>
        <TreeSelect options={activites ?? []} id="par" {...formField('activity')}/>
      </div>
    </div>

    </Dialog>
    </>
  );
}

export default TaskForm;
