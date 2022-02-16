import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useFetch } from '../../Hooks';
import g from 'guark';

import { statusItemTemplate, statusValueTemplate } from '../../Helpers';

import { Button, InputText, Dropdown } from '../../Components';

import { toast } from 'react-toastify';

import { TreeTable } from 'primereact/treetable';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';
import { ListBox } from 'primereact/listbox';
//import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';

function Boards(props:any) {
  const [ statusFetch, statusSignal ]      = useFetch("get_statuses");
  const [ boardHeadFetch, headSignal ]     = useFetch("get_board_heads");
  const [projectsFetch, projectsSignal]    = useFetch("get_projects");
  const [ fragFetch, fragSignal ]          = useFetch("get_board");
  const [updateFragFetch,updateFragSignal] = useFetch("update_fragnet");
  const [updateBoardFetch,updateBoardSignal] = useFetch("update_board");
  const [createBoardFetch,createBoardSignal] = useFetch("create_board");
  const [createFragFetch,createFragSignal] = useFetch("create_fragnet");

  const [ boardHeads, setBoardHeads ]  = useState<any[]>([]);
  const [ frags, setFrags ]            = useState([]);
  const [ statuses, setStatuses ]      = useState([]);
  const [ initiatives, setIni]         = useState([]);
  const [ activeBoard, setActiveBoard] = useState('');
  const [ form, setForm ]              = useState<{[key: string]: any}>({});
  const [ showHead, setShowHead ]      = useState<boolean>(false);
  const [ showFrag, setShowFrag ]      = useState<boolean>(false);
  const [ selectedKey, setSelected ]   = useState<string>('');
  const [ workflowState, setWorkflow ] = useState<{icon:string,label:string,disabled?:boolean,onClick?:()=>void}>();

  const handleShowHead  = () => setShowHead(true);
  const handleCloseHead = () => setShowHead(false);

  const handleShowFrag  = () => setShowFrag(true);
  const handleCloseFrag = () => setShowFrag(false);

  const refresh = () => {
    statusSignal({section:"board"});
    headSignal({});
    projectsSignal({});
  };

  useEffect(() => {
    refresh();
    setForm({...form, draft:true, template:false})
  }, []);

  /* Load Data */
  useEffect(() => {
    if (statusFetch?.error) {
      toast.error('Could not load statuses, ' + statusFetch!.error, {});
    } else {
      const status = statusFetch?.body ?? [];
      setStatuses(status);
    }
  }, [statusFetch]);

  useEffect(() => {
    if (boardHeadFetch?.error) {
      toast.error('Could not load board heads, ' + boardHeadFetch!.error, {});
    } else {
      const heads = boardHeadFetch?.body ?? [];

      // transform board heads into the groupings of Template, Draft, Active
      const grouped_heads = [
        {
          label:"Template", icon:"fa-bookmark",
          items: heads.filter((head:any) => head.state === 0)
        },
        {
          label:"Draft", icon:"fa-edit",
          items: heads.filter((head:any) => head.state === 1)
        },
        {
          label:"Active", icon:"fa-briefcase",
          items: heads.filter((head:any) => head.state === 2)
        },
        {
          label:"Complete", icon:"fa-check-circle",
          items: heads.filter((head:any) => head.state === 3)
        },
      ];

      setBoardHeads(grouped_heads);
    }
  }, [boardHeadFetch]);

  useEffect(() => {
    if (projectsFetch?.error) {
      toast.error('Could not load projects data, ' + projectsFetch!.error, {});
    } else {
      const projdata = projectsFetch?.body ?? [];
      const heads    = boardHeadFetch?.body ?? [];

      setIni(projdata.filter((itm:any) => itm.parent !== 0) // filter for initiatives
                     .filter((itm:any) => !heads.some((head:any) => head.initiative === itm.id))); // filter out inis with a board
    }
  }, [projectsFetch, boardHeadFetch]);

  useEffect(() => {
    if (fragFetch?.error) {
      toast.error('Could not load fragnets, ' + fragFetch!.error, {});
    } else {
      const board_frags = fragFetch?.body ?? [];

      const create_children = (key: string, parent: string) => {
        return board_frags.filter((itm:any) => itm.parent === parent).map((itm:any) => {
          return {
            key: key + '~' + itm.id,
            data: itm,
            children: create_children(key + '~' + itm.id, itm.id),
          };
        });
      };

      setFrags(board_frags.filter((itm:any) => itm.parent === '').map((itm:any) => {
        toast.info(itm)
        return {
          key: itm.id,
          data: itm,
          children: create_children(itm.id, itm.id),
        };
      }));
    }
  }, [fragFetch]);

  useEffect(() => {
    if (updateFragFetch?.error) {
      toast.error('Could not update value, ' + updateFragFetch!.error, {});
    }
  }, [updateFragFetch]);

  useEffect(() => {
    if (updateBoardFetch?.error) {
      toast.error('Could not workflow board, ' + updateBoardFetch!.error, {});
    }
  }, [updateBoardFetch]);

  useEffect(() => {
    if (createFragFetch?.error) {
      toast.error('Could not create fragnet, ' + createFragFetch!.error, {});
    } else if (createFragFetch?.body) {
      toast.success('Fragnet Created', {});
    }
  }, [createFragFetch]);

  useEffect(() => {
    if (createBoardFetch?.error) {
      toast.error('Could not create board, ' + createBoardFetch!.error, {});
    } else if (createBoardFetch?.body) {
      toast.success('Board Created', {});
    }
  }, [createBoardFetch]);

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
      fragSignal({board: activeBoard});
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
        <i className={"fa " + option.icon} style={{marginRight:"5px"}}/>
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
      onChange: (e: any) => setForm({...form, [field]: e.target.value})
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
      let list:TreeNode[] = node?.children ?? nodes;
      node = list.filter((i:TreeNode) => i.data.id == path[0])[0];
      path.shift();
    }

    return node;
  }

  const onEditorValueChange = (props: any, field:string, value: string, id: string) => {
    updateFragSignal({body: JSON.stringify({updateCol: field, updateVal: value.toString(), fragID:id})});
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
    d.setDate(d.getDate() + 1);
    const a = d.toLocaleString('default', {day:'numeric', month:'short', year:'2-digit'}).split(' ');
    return a.join('-');
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
      updateBoardSignal({body: JSON.stringify({updateCol: 'state', updateVal: state.toString(), boardID:activeBoard})});
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
        label: "Scope Lock | Set to Active",
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

  useEffect(()=>{
    setWorkflow(workflow());
  }, [activeBoard]);

  return (
    <>
    <div>
      <div style={{float: "left", width: "20%", display:"flex", flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <span className="p-buttonset">
          <Button onClick={handleShowHead} label="Add Board" />
          <Button onClick={handleShowFrag} label="Add Fragnet" />
        </span>

        <ListBox value={activeBoard} options={boardHeads} optionLabel="title"
          optionValue="id" optionGroupLabel="label" optionGroupChildren="items"
          optionGroupTemplate={groupTemplate}
          onChange={(e) => setActiveBoard(e.value)} listStyle={{height:"calc(100vh - 166px)"}} style={{width:'100%'}} />

          <Button {...workflowState} style={{width:"100%"}} />

      </div>
      <div style={{float: "left", width: "80%"}}>
        <TreeTable value={frags} selectionMode="single" style={{paddingBottom:"30px"}}
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
    <Dialog header="Create a Fragnet" visible={showFrag} onHide={handleCloseFrag} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          createFragSignal({body: JSON.stringify(form)});
        }} />
      </>
    )}>
      <div className='r-form'>
        <div className="r-field r-col-6">
          <label htmlFor="board">Board ID</label>
          <InputText id="board" type="text" disabled={true} {...formText('board_id')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="parent">Parent Fragnet</label>
          <InputText id="parent" type="text" disabled={true} {...formText('parent')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="name">Title</label>
          <InputText id="name" type="text" {...formText('title')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="effort">Effort</label>
          <InputText id="effort" type="number" {...formText('effort')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="moscow">MoSCoW</label>
          <Dropdown id="moscow" options={moscow} {...formDropdown('moscow')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="tcd">Targted Completion Date</label>
          <InputText id="tcd" type="date" {...formText('tcd')}/>
        </div>

      </div>
    </Dialog>

    {/* Board Heads */}
    <Dialog header="Create a Board" visible={showHead} onHide={handleCloseHead} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          createBoardSignal({body: JSON.stringify(form)});
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
    </Dialog>
    </>
  );
};

export default Boards;
