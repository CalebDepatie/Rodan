import React, { useState, useEffect, useRef } from 'react';
import g from 'guark';

import { TreeTable } from 'primereact/treetable';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import {InputSwitch} from 'primereact/inputswitch';

function Boards(props:any) {
  const [ boardHeads, setBoardHeads ]  = useState<any[]>([]);
  const [ frags, setFrags ]            = useState([]);
  const [ statuses, setStatuses ]      = useState([]);
  const [ initiatives, setIni]         = useState([]);
  const [ activeBoard, setActiveBoard] = useState('');
  const [ form, setForm ]              = useState<{[key: string]: any}>({});
  const [ show, setShow ]              = useState<boolean>(false);

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  const toast = useRef<any>(null);

  useEffect(() => {
    const setupData = async () => {
      const statuses = JSON.parse(await g.call("get_statuses", {})
        .catch(error => {
          console.error('Error Getting Data', error);
          return "";
        }));

      setStatuses(statuses);

      const heads = JSON.parse(await g.call("get_board_heads", {})
        .catch(error => {
          console.error('Error Getting Data', error);
          return "";
        }));

      // transform board heads into the groupings of Template, Draft, Active
      const grouped_heads = [
        {
          label:"Template", icon:"pi-book",
          items: heads.filter((head:any) => head.template === true)
        },
        {
          label:"Draft", icon:"pi-clone",
          items: heads.filter((head:any) => head.draft === true && head.template === false)
        },
        {
          label:"Active", icon:"pi-briefcase",
          items: heads.filter((head:any) => head.draft === false && head.template === false)
        },
      ];

      setBoardHeads(grouped_heads);

      const projdata = JSON.parse(await g.call("get_projects", {})
        .catch(error => {
          console.error('Error Getting Data', error);
          return "";
        }));

      setIni(projdata.filter((itm:any) => itm.parent !== 0) // filter for initiatives
                     .filter((itm:any) => !heads.some((head:any) => head.initiative === itm.id))); // filter out inis with a board

      setForm({...form, draft:true, template:false})
    };
    setupData();
  }, []);

  useEffect(() => {
    if (!form["template"] && form["initiative"]) {
      setForm({...form, title: (initiatives.filter((ini:any) => ini.id === form["initiative"])[0])["name"]});
    } else if (form["template"]) {
      setForm({...form, initiative:0});
    }
  }, [form["template"], form["initiative"]]);

  const groupTemplate = (option:any) => {
    return (
      <span>
        <i className={"pi " + option.icon} style={{marginRight:"5px"}}/>
        {option.label}
      </span>
    );
  };

  const formText = (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.target.value})
    };
  };

  const formDropdown = (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.value})
    };
  };

  const formSwitch = (field: string) => {
    return {
      checked: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.value})
    };
  };

  return (
    <>
    <Toast ref={toast} />
    <div>
      <div style={{float: "left", width: "20%"}}>
        <span className="p-buttonset">
          <Button onClick={handleShow} icon="pi pi-plus" label="Add Board" className='p-button-secondary' />
        </span>

        <ListBox value={activeBoard} options={boardHeads} optionLabel="title"
          optionValue="board_id" optionGroupLabel="label" optionGroupChildren="items"
          optionGroupTemplate={groupTemplate}
          onChange={(e) => setActiveBoard(e.value)} style={{height:"20rem", marginTop:"10px"}} />
      </div>
      <div style={{float: "left", width: "80%", paddingLeft:"5px"}}>
        <TreeTable value={[]}>
          <Column field="title" header="Title" expander/>
          <Column field="status" header="Status"/>
          <Column field="effort" header="Effort"/>
          <Column field="moscow" header="MoSCoW"/>
          <Column field="tcd" header="TCD"/>
        </TreeTable>
      </div>
    </div>

    <Dialog header="Create a Board" visible={show} onHide={handleClose} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='p-button-success' onClick={(e:any) => {
          const fn = async () => {
            await g.call("create_board", {body: JSON.stringify(form)})
              .catch(error => {
                console.error('Error Getting Data', error);
                return "";
              });
            toast!.current!.show({severity: 'success', summary: 'Board Created', detail: ''});
          };
          fn();
        }} />
      </>
    )}>
      <div className='p-fluid p-formgrid p-grid'>
        <div className="p-field p-col-6">
          <label htmlFor="name">Title</label>
          <InputText id="name" type="text" disabled={!form["template"]} {...formText('title')}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="tmp">Template</label>
          <InputSwitch id="tmp" {...formSwitch('template')}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="ini">Initiative</label>
          <Dropdown id="ini" options={initiatives} optionValue="id" optionLabel="name"
            disabled={form["template"]} {...formDropdown('initiative')}/>
        </div>

      </div>
    </Dialog>
    </>
  );
};

export default Boards;
