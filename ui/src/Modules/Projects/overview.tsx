import React, { useState, useEffect } from 'react';
import g from 'guark';

import { TreeTable } from 'primereact/treetable';
import TreeNode from 'primereact/treenode';
import { Column } from 'primereact/column';

function ProjectTable(props: any) {
  const [ projectData, setProjects ] = useState<TreeNode[]>();
  const [ statuses, setStatuses ] = useState([]);

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
    const f = new Intl.DateTimeFormat('en', node.data.date);
		const a = f.formatToParts();
    const d = new Date();
    d.setMonth(a[0].value as unknown as number);
		return a[2].value + '-' + d.toLocaleString("default", {month: "short"}) + '-' + a[4].value;


  };

  return (
    <>
      <TreeTable value={projectData}>
        <Column field="name" header="Name" expander/>
        <Column field="descrip" header="Description" />
        <Column field="status" header="Status" body={statusFormat} />
        <Column field="created" header="Created" body={dateFormat} />
      </TreeTable>
    </>
  );
};

export default ProjectTable;
