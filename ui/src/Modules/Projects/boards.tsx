import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import g from 'guark';

import { statusItemTemplate, statusValueTemplate } from '../../Helpers';

import { TreeTable } from 'primereact/treetable';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';

function Boards(props:any) {
  const [ boardHeads, setBoardHeads ]  = useState<any[]>([]);
  const [ frags, setFrags ]            = useState([]);
  const [ statuses, setStatuses ]      = useState([]);
  const [ initiatives, setIni]         = useState([]);
  const [ activeBoard, setActiveBoard] = useState('');
  const [ form, setForm ]              = useState<{[key: string]: any}>({});
  const [ showHead, setShowHead ]      = useState<boolean>(false);
  const [ showFrag, setShowFrag ]      = useState<boolean>(false);
  const [ selectedKey, setSelected ]   = useState<string>('');

  const handleShowHead  = () => setShowHead(true);
  const handleCloseHead = () => setShowHead(false);

  const handleShowFrag  = () => setShowFrag(true);
  const handleCloseFrag = () => setShowFrag(false);

  const toast = useRef<any>(null);

  useEffect(() => {
    const setupData = async () => {
      const statuses = JSON.parse(await g.call("get_statuses", {section:"board"})
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

  useEffect(() => {
    setForm({...form, board_id: activeBoard})
    if (activeBoard && activeBoard !== '') {
      const fn = async () => {
        const board_frags = JSON.parse(await g.call("get_board", {board: activeBoard})
          .catch(error => {
            console.error('Error Getting Data', error);
            return "";
          }));

        const create_children = (key: string, parent: string) => {
          return board_frags.filter((itm:any) => itm.parent === parent).map((itm:any) => {
            return {
              key: key + '~' + itm.id,
              data: itm,
              children: create_children(key + '-' + itm.id, itm.id),
            };
          });
        };

        setFrags(board_frags.filter((itm:any) => itm.parent === '').map((itm:any) => {
          return {
            key: itm.id,
            data: itm,
            children: create_children(itm.id, itm.id),
          };
        }));
      };

      fn();
    }
  }, [activeBoard]);

  useEffect(() => {
    const keys = selectedKey.split('~');
    const id = keys[keys.length-1];
    setForm({...form, parent: id});
  }, [selectedKey]);

  const moscow = [
    {label:"M - Must Have", value:"Must Have"},
    {label:"S - Should Have", value:"Should Have"},
    {label:"C - Could Have", value:"Could Have"},
    {label:"W - Won't Have", value:"Wont Have"},
  ];

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

  const findNodeByKey = (nodes:TreeNode[], key:string): TreeNode|null => {
    const path:string[]    = key.split('~');
    let node:TreeNode|null = null;

    while (path.length) {
      let list:TreeNode[] = node ? node.children : nodes;
      node = list.filter((i:TreeNode) => i.data.id === path[0])[0];
      path.shift();
    }

    return node;
  }

  const onEditorValueChange = (props: any, field:string, value: string, id: string) => {
    g.call("update_fragnet", {body: JSON.stringify({updateCol: field, updateVal: value.toString(), fragID:id})})
      .catch(error => {
        console.error('Error Getting Data', error);
      });
    // update table data
    let newNodes = JSON.parse(JSON.stringify(frags)); // deep copy
    let editedNode = findNodeByKey(newNodes, props.node.key);
    editedNode!.data[props.field] = value;
    setFrags(newNodes);
  };

  const statusEditor = (props: any) => {
    const data = props.node.data.status;
    const id   = props.node.data.id;
    const proj = props.node.data.parent === 0;
    return (
      <Dropdown value={data} onChange={(e) => onEditorValueChange(props, 'status', e.value, id)}
                options={statuses} optionValue='id' optionLabel='name'
                valueTemplate={statusValueTemplate} itemTemplate={statusItemTemplate}/>
    );
  };

  const titleEditor = (props: any) => {
    const data = props.node.data.title;
    const id   = props.node.data.id;
    const proj = props.node.data.parent === 0;
    return (
      <InputText value={data}
        onChange={(e) => onEditorValueChange(props, 'title', e.target.value, id)} />
    );
  };

  const statusFormat = (node: TreeNode) => {
    const status = statuses.filter((i:any) => i.id === node.data.status)[0]["name"];
    return <div className={`status-${node.data.status}`}>{status}</div>
  };

  const dateFormat = (node: TreeNode) => {
    if ((node.data.tcd as unknown as number) == 0) {
      return '';
    }
    const d = new Date((node.data.tcd as unknown as number) * 1000);
    d.setDate(d.getDate() + 1);
    const a = d.toLocaleString('default', {day:'numeric', month:'short', year:'2-digit'}).split(' ');
    return a.join('-');
  };

  const effortFormat = (node: TreeNode) => {
    if (node.data.effort === -1) {
      return '';
    }
    return node.data.effort;
  };

  return (
    <>
    <Toast ref={toast} />
    <div>
      <div style={{float: "left", width: "20%"}}>
        <span className="p-buttonset">
          <Button onClick={handleShowHead} label="Add Board" className='p-button-secondary' />
          <Button onClick={handleShowFrag} label="Add Fragnet" className='p-button-secondary' />
        </span>

        <ListBox value={activeBoard} options={boardHeads} optionLabel="title"
          optionValue="id" optionGroupLabel="label" optionGroupChildren="items"
          optionGroupTemplate={groupTemplate}
          onChange={(e) => setActiveBoard(e.value)} style={{height:"20rem", marginTop:"10px"}} />
      </div>
      <div style={{float: "left", width: "80%"}}>
        <TreeTable value={frags} selectionMode="single" style={{paddingBottom:"30px"}}
          selectionKeys={selectedKey} onSelectionChange={(e:any) => setSelected(e.value)}>
          <Column field="title" header="Title" expander style={{width:"20rem"}} editor={titleEditor}/>
          <Column field="status" header="Status" body={statusFormat} style={{width:"100px"}} editor={statusEditor}/>
          <Column field="effort" header="Effort" body={effortFormat}/>
          <Column field="moscow" header="MoSCoW"/>
          <Column field="tcd" header="TCD" body={dateFormat}/>
        </TreeTable>
      </div>
    </div>
    {/* Board Frags */}
    <Dialog header="Create a Fragnet" visible={showFrag} onHide={handleCloseFrag} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='p-button-success' onClick={(e:any) => {
          const fn = async () => {
            await g.call("create_fragnet", {body: JSON.stringify(form)})
              .catch(error => {
                console.error('Error Getting Data', error);
                return "";
              });
            toast!.current!.show({severity: 'success', summary: 'Fragment Created', detail: ''});
          };
          fn();
        }} />
      </>
    )}>
      <div className='p-fluid p-formgrid p-grid'>
        <div className="p-field p-col-6">
          <label htmlFor="board">Board ID</label>
          <InputText id="board" type="text" disabled={true} {...formText('board_id')}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="parent">Parent Fragnet</label>
          <InputText id="parent" type="text" disabled={true} {...formText('parent')}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="name">Title</label>
          <InputText id="name" type="text" {...formText('title')}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="effort">Effort</label>
          <InputText id="effort" type="number" {...formText('effort')}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="status">Status</label>
          <Dropdown id="status" options={statuses} optionValue='id' optionLabel='name' {...formDropdown('status')}
            valueTemplate={statusValueTemplate} itemTemplate={statusItemTemplate}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="moscow">MoSCoW</label>
          <Dropdown id="moscow" options={moscow} {...formDropdown('moscow')}/>
        </div>

        <div className="p-field p-col-6">
          <label htmlFor="tcd">Targted Completion Date</label>
          <InputText id="tcd" type="date" {...formText('tcd')}/>
        </div>

      </div>
    </Dialog>

    {/* Board Heads */}
    <Dialog header="Create a Board" visible={showHead} onHide={handleCloseHead} position='center' modal style={{width: '70vw'}} footer={(
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
