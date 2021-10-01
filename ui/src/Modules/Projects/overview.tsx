import React, { useState, useEffect, useRef } from 'react';
import { useFetch } from '../../Hooks';
import g from 'guark';

import { statusItemTemplate, statusValueTemplate } from '../../Helpers';

import { Button, InputText, Dropdown } from '../../Components';

import { TreeTable } from 'primereact/treetable';
//import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';
//import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';

function ProjectTable(props: any) {
  const [projectsFetch, projectsSignal] = useFetch("get_projects");
  const [statusFetch, statusSignal]     = useFetch("get_statuses");
  const [ updateFetch, updateSignal ]   = useFetch("update_project");
  const [ createFetch, createSignal ]   = useFetch("create_project");

  const [ projectData, setProjectsdata ] = useState<TreeNode[]>();
  const [ statuses, setStatuses ]    = useState([]);
  const [ show, setShow ]            = useState<boolean>(false);
  const [ showMove, setShowMove ]    = useState<boolean>(false);
  const [ form, setForm ]            = useState<{[key: string]: any}>({});
  const [ projects, setProjects]     = useState([]);

  const toast = useRef<any>(null);

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleShowMove  = () => setShowMove(true);
  const handleCloseMove = () => setShowMove(false);

  const refresh = () => {
    // signal all fetch commands
    projectsSignal({});
    statusSignal({section:"project"});
  };

  useEffect(() => {
    refresh();
  }, []);

  /* Load Data */
  useEffect(() => {
    if (projectsFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not load projects', detail:projectsFetch!.error, life:3000});
    } else {
      const projdata = projectsFetch?.body ?? [];

      const initiatives = projdata.filter((itm:any) => itm.parent !== 0);
      const projects    = projdata.filter((itm:any) => itm.parent === 0);
      setProjects(projects.concat([{id: 0, name:"None"}]));

      const ini = initiatives.map((itm: any) => {
        return {
          key: itm.parent + '-' + itm.id,
          data: itm,
          children: null,
        };
      });

      setProjectsdata(projects.map((proj: any) => {
        return {
          key: proj.id.toString(),
          data: proj,
          children: ini.filter((i: any) => i.data.parent === proj.id),
        }
      }));
    }
  }, [projectsFetch]);

  useEffect(() => {
    if (statusFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not load statuses', detail:statusFetch!.error, life:3000});
    } else {
      const status = statusFetch?.body ?? [];
      setStatuses(status);
    }
  }, [statusFetch]);

  useEffect(() => {
    if (updateFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not update value', detail:updateFetch!.error, life:3000});
    } else {
      toast.current.show({severity:'success', summary:'Updated Value', life:3000});
    }
  }, [updateFetch]);

  useEffect(() => {
    if (createFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not create project', detail:createFetch!.error, life:3000});
    } else if (createFetch?.body) {
      toast.current.show({severity: 'success', summary: 'Project Created', detail: ''});
    };
  }, [createFetch]);

  const statusFormat = (node: TreeNode) => {
    const status = statuses.filter((i:any) => i.id === node.data.status)[0]?.["name"];
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
      onChange: (e: any) => setForm({...form, [field]: e.value})
    };
  };

  const findNodeByKey = (nodes:TreeNode[], key:string): TreeNode => {
    const path:string[]    = key.split('-');
    let node:TreeNode|null = null;

    node = nodes.filter((i:TreeNode) => i.key === path[0])[0];

    if (path.length > 1) {
      const children:TreeNode[] = node.children;
      node = children.filter((i:TreeNode) => i.key === key)[0];
    }

    return node;
  }

  const onEditorValueChange = (props: any, field:string, value: string, proj: boolean, id: number) => {
    updateSignal({body: JSON.stringify({updateCol: field, updateVal: value.toString(),
                                      ...(proj ? {projID: id} : {iniID: id} )})})
    // update table data
    let newNodes = JSON.parse(JSON.stringify(projectData)); // deep copy
    let editedNode = findNodeByKey(newNodes, props.node.key);
    editedNode.data[props.field] = value;
    setProjectsdata(newNodes);
  };

  const statusEditor = (props: any) => {
    const data = props.node.data.status;
    const id   = props.node.data.id;
    const proj = props.node.data.parent === 0;
    return (
      <Dropdown value={data} onChange={(e) => onEditorValueChange(props, 'status', e.value, proj, id)}
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
      <Toast ref={toast} />
      <TreeTable value={projectData} header={header} tableClassName="proj-table" style={{paddingBottom:"30px"}}>
        <Column field="name" header="Name" expander/>
        <Column field="descrip" header="Description" editor={descripEditor} bodyClassName ="big-text"/>
        <Column field="status" header="Status" body={statusFormat} editor={statusEditor} style={{width:"100px"}} />
        <Column field="created" header="Created" body={dateFormat} style={{width:"110px"}} />
      </TreeTable>

      <Dialog header="Create a Project" visible={show} onHide={handleClose} position='center' modal style={{width: '70vw'}} footer={(
        <>
          <Button label='Submit' className='r-button-success' onClick={(e:any) => {
            createSignal({body: JSON.stringify(form)});
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
            <label htmlFor="status">Status</label>
            <Dropdown id="status" options={statuses} optionValue='id' optionLabel='name' {...formDropdown('status')}
              valueTemplate={statusValueTemplate} itemTemplate={statusItemTemplate}/>
          </div>

          <div className="r-field r-col-6">
            <label htmlFor="par">Parent</label>
            <Dropdown id="par" options={projects} optionValue='id' optionLabel='name' {...formDropdown('parent')}/>
          </div>
        </div>
      </Dialog>

      <Dialog header="Move Project" visible={showMove} onHide={handleCloseMove} position='center' modal style={{width: '70vw'}} footer={(
        <>
          <Button label='Submit' className='r-button-success' onClick={(e:any) => {
            updateSignal({body: JSON.stringify({...form, updateCol:"parent", updateVal: form.updateVal.toString()})});
          }} />
        </>
      )}>
        <div className='r-form'>
          <div className="r-field r-col-6">
            <label htmlFor="status">Initiative</label>
            <Dropdown id="status" options={projectsFetch?.body?.filter((itm:any) => itm.parent !== 0)} optionValue='id' optionLabel='name' {...formDropdown('iniID')}/>
          </div>

          <div className="r-field r-col-6">
            <label htmlFor="par">To</label>
            <Dropdown id="par" options={projectsFetch?.body?.filter((itm:any) => itm.parent === 0)} optionValue='id' optionLabel='name' {...formDropdown('updateVal')}/>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProjectTable;
