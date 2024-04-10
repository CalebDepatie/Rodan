import React, { useState, useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'

import { statusItemTemplate, statusValueTemplate, fieldGen } from '../../Helpers'
import { Button, InputText, Dropdown, Modal, InputTextArea, TreeNode, TreeTable } from '../../Components'
import { Column } from '../../Components/table/table'
import { useCache } from '../../Hooks'
import { dateFormatter } from 'common'

import { toast } from 'react-toastify'

function ProjectTable(props: any) {
  const [ statuses, setStatuses ]    = useState([]);
  const [ show, setShow ]            = useState<boolean>(false);
  const [ showMove, setShowMove ]    = useState<boolean>(false);
  const [ form, setForm ]            = useState<{[key: string]: any}>({});
  const [ projects, setProjects]     = useState([[], [], []]);

  const [ projects_cache, projects_signal ] = useCache('projects-get', {})
  const [ status_cache, status_signal ] = useCache('statuses-get', {section:"project"})

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleShowMove  = () => setShowMove(true);
  const handleCloseMove = () => setShowMove(false);

  const refresh = () => {
    projects_signal()
  };

  useEffect(() => {
    if (projects_cache.error != undefined) {
      toast.error('Could not load projects: ' + projects_cache.error.message)
    }

    setProjects(projects_cache.body ?? [[], [], []])
  }, [projects_cache])

  useEffect(() => {
    if (status_cache.error != undefined) {
      toast.error('Could not load statuses: ' + status_cache.error.message)
    }

    setStatuses(status_cache.body ?? [])
  }, [status_cache])

  const statusFormat = (node: TreeNode) => {
    const status = statuses.filter((i:any) => parseInt(i.id) === parseInt(node.data.status))[0]?.["name"];
    return <div className={`status-${node.data.status}`}>{status}</div>
  };

  const dateFormat = (node: TreeNode) => {
    const d = new Date((node.data.created as unknown as number) * 1000);
    return dateFormatter(d);
  };

  const formText = fieldGen(form, setForm);

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
      toast.error('Could not update value: ' + res.error.message);
      return
    }

    // update table data
    await refresh()
  };

  const statusEditor = (props: any) => {
    const data = props.data.status;
    const id   = props.data.id;
    const proj = props.data.parent === 0;
    return (
      <Dropdown value={data} onChange={(e: any) => onEditorValueChange(props, 'status', e.target.value, proj, id)}
                options={statuses} optionValue='id' optionLabel='name'
                valueTemplate={statusValueTemplate} itemTemplate={statusItemTemplate}/>
    );
  };

  const descripEditor = (props: any) => {
    const data = props.data.descrip;
    const id   = props.data.id;
    const proj = props.data.parent === 0;
    return (
      <InputTextArea value={data}
        onChange={(e) => onEditorValueChange(props, 'description', e.target.value, proj, id)} />
    );
  };

  const bigTextBody = (props: any) => {
    return <div className="big-text">{props.data.descrip}</div>;
  }

  const header = (
    <>
      <Button icon="fa fa-plus" label="Add Project" onClick={handleShow} />
      <Button icon="fa fa-arrow-right" label="Move Initiative" onClick={handleShowMove} />
    </>
  );

  /*<Column field="name" header="Name" expander/>
        <Column field="descrip" header="Description" editor={descripEditor} bodyClassName ="big-text"/>
        <Column field="status" header="Status" body={statusFormat} editor={statusEditor} style={{width:"100px"}} />
        <Column field="created" header="Created" body={dateFormat} style={{width:"110px"}} />*/

  const columns:Column[] = [
    { field: "name", header: "Name"},
    { field: "descrip", header: "Description", editor: descripEditor, body: bigTextBody},
    { field: "status", header: "Status", body: statusFormat, editor: statusEditor},
    { field: "created", header: "Created", body: dateFormat }
  ]

  return (
    <>
      <TreeTable value={projects[2]} header={header} columns={columns} 
        tableClassName="proj-table" style={{paddingBottom:"30px"}} />

      <Modal header="Create a Project" visible={show} onHide={handleClose} style={{width: '70vw'}} footer={(
        <>
          <Button label='Submit' className='r-button-success' onClick={(e:any) => {
            ipcRenderer.invoke('projects-create', {...form})
              .then(res => {
                if (res.error != undefined) {
                  toast.error("Could not create project: " + res.error.message)
                  return
                }
                refresh()
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
      </Modal>

      <Modal header="Move Project" visible={showMove} onHide={handleCloseMove} style={{width: '70vw'}} footer={(
        <>
          <Button label='Submit' className='r-button-success' onClick={async (e:any) => {
            const res = await ipcRenderer.invoke('projects-update', {
              updateCol: 'parent',
              updateVal: form.updateVal.toString(),
              iniID: form.iniID,
            });

            if (res.error != undefined) {
              toast.error('Could not move initiative: ' + res.error.message);
              return
            }

            refresh()
            handleCloseMove()
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
      </Modal>
    </>
  );
};

export default ProjectTable;
