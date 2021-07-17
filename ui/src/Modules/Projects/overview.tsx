import React, { useState, useEffect } from 'react';
import g from 'guark';

import { TreeTable } from 'primereact/treetable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';

function ProjectTable(props: any) {
  const [ projectData, setProjects ] = useState<TreeNode[]>();
  const [ statuses, setStatuses ]    = useState([]);
  const [ show, setShow ]            = useState<boolean>(false);

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

      const ini = initiatives.map((itm: any) => {
        return {
          key: itm.parent + '-' + itm.id,
          data: itm,
          children: null,
        };
      });

      setProjects(projects.map((proj: any) => {
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
    const a = d.toLocaleString('default', {day:'numeric', month:'short', year:'numeric'}).split(' ');
    return a.join('-');
  };

  const header = (
    <>
      <Button icon="pi pi-plus" label="Add Project" onClick={handleShow} className='p-button-secondary' />
    </>
  );

  return (
    <>
      <TreeTable value={projectData} header={header}>
        <Column field="name" header="Name" expander/>
        <Column field="descrip" header="Description" />
        <Column field="status" header="Status" body={statusFormat} />
        <Column field="created" header="Created" body={dateFormat} />
      </TreeTable>

      <Dialog header="Create a Project" visible={show} onHide={handleClose} position='center' style={{width: '60vw'}} footer={(
        <>
          <Button label='Submit' className='p-button-success' />
        </>
      )}>
        Content
      </Dialog>
    </>
  );
};

export default ProjectTable;
