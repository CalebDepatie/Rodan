import React, { useState, useEffect, useRef } from 'react';
import g from 'guark';

import { TreeTable } from 'primereact/treetable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

function ProjectTable(props: any) {
  const [ projectData, setProjectsdata ] = useState<TreeNode[]>();
  const [ statuses, setStatuses ]    = useState([]);
  const [ show, setShow ]            = useState<boolean>(false);
  const [ form, setForm ]            = useState<{[key: string]: any}>({});
  const [ projects, setProjects]     = useState([]);

  const toast = useRef<any>(null);

  const handleShow  = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    const setupData = async () => {
      const statuses = JSON.parse(await g.call("get_statuses", {})
        .catch(error => {
          console.error('Error Getting Data', error);
          return "";
        }));

      setStatuses(statuses);

      const projdata = JSON.parse(await g.call("get_projects", {})
        .catch(error => {
          console.error('Error Getting Data', error);
          return "";
        }));

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
          key: proj.id,
          data: proj,
          children: ini.filter((i: any) => i.data.parent === proj.id),
        }
      }));
    }

    setupData();
  }, []);

  const statusFormat = (node: TreeNode) => {
    const status = statuses.filter((i:any) => i.id === node.data.status)[0]["name"];
    return status;
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

  const header = (
    <>
      <Button icon="pi pi-plus" label="Add Project" onClick={handleShow} className='p-button-secondary' />
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <TreeTable value={projectData} header={header}>
        <Column field="name" header="Name" expander/>
        <Column field="descrip" header="Description" />
        <Column field="status" header="Status" body={statusFormat} />
        <Column field="created" header="Created" body={dateFormat} />
      </TreeTable>

      <Dialog header="Create a Project" visible={show} onHide={handleClose} position='center' modal style={{width: '70vw'}} footer={(
        <>
          <Button label='Submit' className='p-button-success' onClick={(e:any) => {
            const fn = async () => {
              await g.call("create_project", {body: JSON.stringify(form)})
                .catch(error => {
                  console.error('Error Getting Data', error);
                  return "";
                });
              toast!.current!.show({severity: 'success', summary: 'Project Created', detail: ''});
            };
            fn();
          }} />
        </>
      )}>
        <div className='p-fluid p-formgrid p-grid'>
          <div className="p-field p-col-6">
            <label htmlFor="name">Name</label>
            <InputText id="name" type="text" {...formText('name')}/>
          </div>

          <div className="p-field p-col-6">
            <label htmlFor="de">Description</label>
            <InputText id="de" type="text" {...formText('descrip')}/>
          </div>

          <div className="p-field p-col-6">
            <label htmlFor="status">Status</label>
            <Dropdown id="status" options={statuses} optionValue='id' optionLabel='name' {...formDropdown('status')}/>
          </div>

          <div className="p-field p-col-6">
            <label htmlFor="par">Parent</label>
            <Dropdown id="par" options={projects} optionValue='id' optionLabel='name' {...formDropdown('parent')}/>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProjectTable;
