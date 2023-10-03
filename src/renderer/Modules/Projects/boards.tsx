import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { ipcRenderer } from 'electron'

import { Button, InputText, Dropdown, Modal, List, InputSwitch } from '../../Components'
import { useCache } from '../../Hooks'
import { fieldGen, fieldValGen, statusItemTemplate, statusValueTemplate, findNodeByKey } from '../../Helpers'
import { dateFormatter } from 'common'

import { toast } from 'react-toastify'

import { TreeTable } from 'primereact/treetable'
import TreeNode from 'primereact/treenode'
import { Column } from 'primereact/column'

function Boards(props:any) {
  const [ boardHeads, setBoardHeads ]  = useState<any[]>([]);
  const [ frags, setFrags ]            = useState<TreeNode[]>([]);
  const [ statuses, setStatuses ]      = useState([]);
  const [ initiatives, setIni]         = useState([]);
  const [ activeBoard, setActiveBoard] = useState<string>('');
  const [ form, setForm ]              = useState<{[key: string]: any}>({});
  const [ showHead, setShowHead ]      = useState<boolean>(false);
  const [ showFrag, setShowFrag ]      = useState<boolean>(false);
  const [ selectedKey, setSelected ]   = useState<string>('');
  const [ workflowState, setWorkflow ] = useState<{icon:string,label:string,disabled?:boolean,onClick?:()=>void}>();

  const [ boards_cache, boards_signal ] = useCache('boards-get', {})

  const handleShowHead  = () => setShowHead(true);
  const handleCloseHead = () => setShowHead(false);

  const handleShowFrag  = () => setShowFrag(true);
  const handleCloseFrag = () => setShowFrag(false);

  const refresh = async () => {
    await boards_signal()
  }

  useEffect(() => {
    if (boards_cache.error != undefined) {
      toast.error("Could not get boards: " + boards_cache.error)
    }

    boards_cache.body ??= [[], []]

    setBoardHeads(boards_cache.body[0].map((board:any) => ({...board, icon:"fa " + board.icon})))
    setIni(boards_cache.body[1])
  }, [boards_cache])

  useEffect(() => {
    setForm({...form, draft:true, template:false})

    const fn = async () => {
      const res = await ipcRenderer.invoke('statuses-get', {section:"board"});

      if (res.error != undefined) {
        toast.error('Could not load statuses: ' + res.error.message)
      }

      setStatuses(res.body);
    };
    fn();
  }, []);

  useEffect(() => {
    if (!form["template"] && form["initiative"]) {
      setForm({...form, title: (initiatives.filter((ini:any) => ini.id === parseInt(form["initiative"]))[0])["name"]});
    } else if (form["template"]) {
      setForm({...form, initiative:0});
    }
  }, [form["template"], form["initiative"]]);

  const refreshFrags = async () => {
    const res = await ipcRenderer.invoke('boards-frags', {board: activeBoard})
    if (res.error != undefined) {
      toast.error("Could not load board frags: " + res.error.message)
    }
    setFrags(res.body);
  }

  const moscow = [
    {label:"Nothing Selected", value:null},
    {label:"M - Must Have", value:"Must Have"},
    {label:"S - Should Have", value:"Should Have"},
    {label:"C - Could Have", value:"Could Have"},
    {label:"W - Won't Have", value:"Wont Have"},
  ];

  const formText     = fieldGen(form, setForm);
  const formDropdown = fieldGen(form, setForm);
  const formSwitch   = fieldValGen(form, setForm);

  const onEditorValueChange = async (props: any, field:string, value: string, id: string) => {
    const res = await ipcRenderer.invoke('boards-frags-update', {updateCol: field, updateVal: value.toString(), fragID:id});
    if (res.error != undefined) {
      toast.error("Could not update fragnet: " + res.error.message)
      return
    }
    // update table data
    setFrags(curNodes => {
      let editedNode = findNodeByKey(curNodes, props.node.key);
      editedNode!.data[props.field] = value;

      return JSON.parse(JSON.stringify(curNodes))
    });
  };

  const statusEditor = (props: any) => {
    const data = props.node.data.status;
    const id   = props.node.data.id;
    const proj = props.node.data.parent === 0;
    return (
      <Dropdown value={data} onChange={(e) => onEditorValueChange(props, 'status', e.target.value, id)}
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
    const status = statuses.filter((i:any) => parseInt(i.id) === parseInt(node.data.status))[0]["name"];
    return <div className={`status-${node.data.status}`}>{status}</div>
  };

  const dateFormat = (node: TreeNode) => {
    if ((node.data.tcd as unknown as number) == 0) {
      return '';
    }
    const d = new Date((node.data.tcd as unknown as number) * 1000);
    return dateFormatter(d)
  };

  const tasksFormat = (node: TreeNode) => {
    const count_children = (parent: TreeNode): number => {
      let cur_count:number = 0;
      parent.children?.forEach((el:TreeNode) => {
        cur_count += count_children(el);
      });

      return cur_count + parent.data.tasks;
    }

    const tasks_count = count_children(node);

    if (tasks_count === 0) {
      return '';
    } else if (tasks_count - node.data.tasks === 0) {
      return tasks_count;
    } else {
      return `${tasks_count} ( ${node.data.tasks} + ${tasks_count-node.data.tasks} )`;
    }
  };

  const getBoardState = ():number => {
    const head = boardHeads.filter((group:{label:string,icon:string,items:any[]}) => {
      return group.items.some((itm:any) => itm.id === activeBoard);
    });

    return head[0]?.items[0].state ?? -1;
  };

  const workflow = () => {
    const state:number = getBoardState();

    const updateHead = async (state:number) => {
      const res = await ipcRenderer.invoke('boards-update', {updateCol: 'state', updateVal: state.toString(), boardID:activeBoard});
      if (res.error != undefined) {
        toast.error("Could not workflow board: " + res.error.message)
      } else {
        refresh()
      }
    };

    switch (state) {
      case -1: return {
        icon: "fa fa-exclamation-triangle",
        label: "No Board Selected",
        disabled: true,
      };
      case 0: return {
        icon: "fa fa-stop-circle",
        label: "No Further Workflow",
        disabled: true,
      };
      case 1: return {
        icon: "fa fa-lock",
        label: "Set to Active",
        onClick: () => { updateHead(2) },
      };
      case 2: return {
        icon: "fa fa-archive",
        label: "Set to Complete",
        onClick: () => { updateHead(3) },
      };
      case 3: return {
        icon: "fa fa-stop-circle",
        label: "No Further Workflow",
        disabled: true,
      };
    };
  }

  let board_name = "No board selected"
  const parent_name = findNodeByKey(frags, selectedKey)?.data?.title ?? ""

  board_search:
  for (let head in boardHeads) {
    for (let board in boardHeads[head].items) {
      if (boardHeads[head].items[board].id != activeBoard)
        continue

      board_name = boardHeads[head].items[board].title

      break board_search
    }
  }

  useEffect(() => {
    setForm({...form, board_id: activeBoard})
    if (activeBoard && activeBoard !== '') {
      refreshFrags()
    }

    setWorkflow(workflow());
  }, [activeBoard]);

  useEffect(() => {
    const keys = selectedKey.split('~');
    const id = keys[keys.length-1];
    setForm({...form, parent: id});
  }, [selectedKey]);

  const rowStyler = (row:any) => {
    let style = {}

    if (row.data.status == 9 || row.data.status == 8) {
      style = {...style, "r-completed": true}
    }

    return style
  }

  return (
    <>
    <div>
      <div style={{float: "left", width: "20%", display:"flex", flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <span className="p-buttonset">
          <Button onClick={handleShowHead} label="Add Board" />
          <Button onClick={handleShowFrag} label="Add Fragnet" />
        </span>

        <List selectionKeys={activeBoard} value={boardHeads} optionLabel="title"
          optionValue="id" optionGroupLabel="label" optionGroupChildren="items"
          onChange={(e) => setActiveBoard(e.value)} style={{height:"calc(100vh - 144px)", width:"100%"}} />

          <Button {...workflowState} style={{width:"100%"}} />

      </div>
      <div style={{float: "left", width: "80%", height:"calc(100vh - 90px)", overflowY:"scroll"}}>
        <TreeTable value={frags} selectionMode="single" rowClassName={rowStyler} style={{paddingBottom:"30px"}}
          selectionKeys={selectedKey} onSelectionChange={(e:any) => setSelected(e.value)}>
          <Column field="title" header="Title" expander style={{width:"20rem"}} editor={titleEditor}/>
          <Column field="status" header="Status" body={statusFormat} style={{width:"100px"}} editor={statusEditor}/>
          <Column field="tasks" header="Tasks" body={tasksFormat} style={{width:"100px"}}/>
          <Column field="moscow" header="MoSCoW" style={{width:"100px"}}/>
          <Column field="tcd" header="TCD" body={dateFormat} style={{width:"110px"}}/>
        </TreeTable>
      </div>
    </div>
    {/* Board Frags */}
    <Modal header="Create a Fragnet" visible={showFrag} onHide={handleCloseFrag} style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          ipcRenderer.invoke('boards-frags-create', form)
            .then(res => {
              if (res.error != undefined) {
                toast.error("Could not create fragnet: " + res.error.message)
                return
              }
              refreshFrags();
              toast.success("Fragnet Created")
            });
        }} />
      </>
    )}>
      <div className='r-form'>
        <div className="r-field r-col-6">
          <label htmlFor="board">Board</label>
          <InputText id="board" type="text" disabled={true} value={board_name}/>
        </div>

        <div className="r-field r-col-4">
          <label htmlFor="parent">Parent Fragnet</label>
          <InputText id="parent" type="text" disabled={true} value={parent_name}/>
        </div>

        <div className="r-field r-col-2">
          <label htmlFor="clear">Clear</label>
          <Button id="clear" icon="fa fa-x" onClick={()=>setSelected('')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="name">Title</label>
          <InputText id="name" type="text" {...formText('title')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="moscow">MoSCoW</label>
          <Dropdown id="moscow" options={moscow} {...formDropdown('moscow')}/>
        </div>

      </div>
    </Modal>

    {/* Board Heads */}
    <Modal header="Create a Board" visible={showHead} onHide={handleCloseHead} style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          ipcRenderer.invoke('boards-create', {...form, initiative: parseInt(form["initiative"])})
            .then(res => {
              if (res.error != undefined) {
                toast.error("Could not create board: " + res.error.message)
                return
              }
              refresh()
              toast.success("Board Created")
            });
        }} />
      </>
    )}>
      <div className='r-form'>
        <div className="r-field r-col-6">
          <label htmlFor="name">Title</label>
          <InputText id="name" type="text" disabled={!form["template"]} {...formText('title')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="tmp">Template</label>
          <InputSwitch id="tmp" {...formSwitch('template')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="ini">Initiative</label>
          <Dropdown id="ini" options={initiatives} optionValue="id" optionLabel="name"
            disabled={form["template"]} {...formDropdown('initiative')}/>
        </div>

      </div>
    </Modal>
    </>
  );
};

export default Boards;
