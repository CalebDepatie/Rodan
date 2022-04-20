import React, { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';

import { statusItemTemplate, statusValueTemplate } from '../../Helpers';

import { Button, InputText, Dropdown } from '../../Components';

import { toast } from 'react-toastify';

import { TreeTable } from 'primereact/treetable';
import { Dialog } from 'primereact/dialog';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';

function ProjectTable(props: any) {
  const [ statuses, setStatuses ]    = useState([]);
  const [ show, setShow ]            = useState<boolean>(false);
  const [ showMove, setShowMove ]    = useState<boolean>(false);
  const [ form, setForm ]            = useState<{[key: string]: any}>({});
  const [ projects, setProjects]     = useState([[], [], []]);

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleShowMove  = () => setShowMove(true);
  const handleCloseMove = () => setShowMove(false);

  const refresh = async () => {
    // get projects
    const res = await ipcRenderer.invoke('projects-get');

    if (res.error != undefined) {
      toast.error('Could not load projects: ' + res.error)
    }

    setProjects(res.body)
  };

  useEffect(() => {
    refresh();

    const fn = async () => {
      const res = await ipcRenderer.invoke('statuses-get', {section:"project"});

      if (res.error != undefined) {
        toast.error('Could not load statuses: ' + res.error)
      }

      setStatuses(res.body);
    };
    fn();

  }, []);

  const statusFormat = (node: TreeNode) => {
    const status = statuses.filter((i:any) => parseInt(i.id) === parseInt(node.data.status))[0]?.["name"];
    return <div className={`status-${node.data.status}`}>{status}</div>
  };

  const dateFormat = (node: TreeNode) => {
    const d = new Date((node.data.created as unknown as number) * 1000);
    d.setDate(d.getDate() + 1);
    const a = d.toLocaleString('default', {day:'numeric', month:'short', year:'2-digit'}).split(' ');
    return a.join('-');
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
      onChange: (e: any) => setForm({...form, [field]: parseInt(e.target.value)})
    };
  };

  const findNodeByKey = (nodes:TreeNode[], key:string): TreeNode => {
    const path:string[]    = key.split('-');
    let node:TreeNode|null = null;

    node = nodes.filter((i:TreeNode) => i.key === path[0])[0];

    if (path.length > 1) {
      const children:TreeNode[] = node?.children ?? [];
      node = children.filter((i:TreeNode) => i.key === key)[0];
    }

    return node;
  }

  const onEditorValueChange = async (props: any, field:string, value: string, proj: boolean, id: number) => {
    const res = await ipcRenderer.invoke('projects-update',{updateCol: field, updateVal: value.toString(), ...(proj ? {projID: id} : {iniID: id} )});

    if (res.error != undefined) {
      toast.error('Could not update value, ' + updateFetch!.error, {});
    }

    // update table data
    setProjects(curProjects => { // deep copy
      let editedNode = findNodeByKey(curProjects[2], props.node.key);
      editedNode.data[props.field] = value;

      return JSON.parse(JSON.stringify(curProjects));
    });
  };

  const statusEditor = (props: any) => {
    const data = props.node.data.status;
    const id   = props.node.data.id;
    const proj = props.node.data.parent === 0;
    return (
      <Dropdown value={data} onChange={(e: any) => onEditorValueChange(props, 'status', e.target.value, proj, id)}
                options={statuses} optionValue='id' optionLabel='name'
                valueTemplate={statusValueTemplate} itemTemplate={statusItemTemplate}/>
    );
  };

  const descripEditor = (props: any) => {
    const data = props.node.data.descrip;
    const id   = props.node.data.id;
    const proj = props.node.data.parent === 0;
    return (
      <InputTextarea value={data} autoResize
        onChange={(e) => onEditorValueChange(props, 'description', e.target.value, proj, id)} />
    );
  };

  const header = (
    <>
      <Button icon="fa fa-plus" label="Add Project" onClick={handleShow} />
      <Button icon="fa fa-arrow-right" label="Move Initiative" onClick={handleShowMove} />
    </>
  );

  return (
    <>
      <TreeTable value={projects[2]} header={header} tableClassName="proj-table" style={{paddingBottom:"30px"}}>
        <Column field="name" header="Name" expander/>
        <Column field="descrip" header="Description" editor={descripEditor} bodyClassName ="big-text"/>
        <Column field="status" header="Status" body={statusFormat} editor={statusEditor} style={{width:"100px"}} />
        <Column field="created" header="Created" body={dateFormat} style={{width:"110px"}} />
      </TreeTable>

      <Dialog header="Create a Project" visible={show} onHide={handleClose} style={{width: '70vw'}} footer={(
        <>
          <Button label='Submit' className='r-button-success' onClick={(e:any) => {
            ipcRenderer.invoke('projects-create', {...form})
              .then(res => {
                if (res.error != undefined) {
                  toast.error("Could not create project: " + res.error)
                  return
                }
                toast.success("New project created");
              })
          }} />
        </>
      )}>
        <div className='r-form'>
          <div className="r-field r-col-6">
            <label htmlFor="name">Name</label>
            <InputText id="name" type="text" {...formText('name')}/>
          </div>

          <div className="r-field r-col-6">
            <label htmlFor="de">Description</label>
            <InputText id="de" type="text" {...formText('descrip')}/>
          </div>

          <div className="r-field r-col-6">
            <label htmlFor="par">Parent</label>
            <Dropdown id="par" options={[{id: 0, name:"None"},...projects[0]]} optionValue='id' optionLabel='name' {...formDropdown('parent')}/>
          </div>
        </div>
      </Dialog>

      <Dialog header="Move Project" visible={showMove} onHide={handleCloseMove} style={{width: '70vw'}} footer={(
        <>
          <Button label='Submit' className='r-button-success' onClick={(e:any) => {
            updateSignal({...form, updateCol:"parent", updateVal: form.updateVal.toString()});
          }} />
        </>
      )}>
        <div className='r-form'>
          <div className="r-field r-col-6">
            <label htmlFor="status">Initiative</label>
            <Dropdown id="status" options={projects[1]} optionValue='id' optionLabel='name' {...formDropdown('iniID')}/>
          </div>

          <div className="r-field r-col-6">
            <label htmlFor="par">To</label>
            <Dropdown id="par" options={projects[0]} optionValue='id' optionLabel='name' {...formDropdown('updateVal')}/>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProjectTable;
