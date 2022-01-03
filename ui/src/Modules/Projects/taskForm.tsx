import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useFetch } from '../../Hooks';
import g from 'guark';

import { Button, InputText, Dropdown } from '../../Components';

import { Dialog } from 'primereact/dialog';
import { TreeSelect } from 'primereact/treeselect';
import { Toast } from 'primereact/toast';

function TaskForm(props:{show:boolean, handleClose:()=>void, onSubmit?:(f:any)=>void}) {
  const [ createFetch, createSignal ] = useFetch("create_task");
  const [ boardHeadFetch, headSignal ]= useFetch("get_board_heads");
  const [ fragFetch, fragSignal ]     = useFetch("get_board");

  const [ form, setForm ] = useState<{[key: string]: any}>({});
  const [ frags, setFrags ] = useState<any[]>([]);
  const [ boardHeads, setBoardHeads ]  = useState<any[]>([]);
  const [ activites, setActivities ] = useState<any[]>([]);

  const toast = useRef<any>(null);

  useEffect(() => headSignal({}), [])

  useEffect(() => {
    if (createFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not create task', detail:createFetch!.error, life:3000});
    } else if (createFetch?.body) {
      toast.current.show({severity: 'success', summary: 'Task Created', detail: ''});
    };
  }, [createFetch]);

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
    setActivities(boardHeads.map((head:any) => {
      return {
        label: head.title,
        key: head.id,
        data: head.id,
        children: frags.filter((frag:any) => frag.board_id === head.id) ?? [],
      }
    }));
  }, [frags]);

  useEffect(() => {
    boardHeads.forEach((head:any, idx:number) => {
      setTimeout(()=>fragSignal({board: head.id}), 50*idx);
    });
  }, [boardHeads]);

  const formField = (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.target.value})
    };
  };

  return (
    <>
    <Toast ref={toast}/>
    <Dialog header="Create a Task" visible={props.show} onHide={props.handleClose} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          createSignal({body: JSON.stringify(form)});
          props?.onSubmit?.(form);
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
