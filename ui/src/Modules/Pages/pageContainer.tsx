import React, { useState, useRef, useEffect } from 'react';

import { useFetch } from '../../Hooks';

import PageViewer from './pageViewer';

import { Tree } from 'primereact/tree';
import TreeNode from 'primereact/treenode';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Button, InputText } from '../../Components';

function PageContainer(props:{}) {
  const [ edit, setEdit ] = useState(false);
  const [ nodes, setNodes ] = useState<any>([]);
  const [ selectedKey, setSelectedKey ] = useState('');

  const toast = useRef<any>(null);

  const [ pageFetch, pageSignal ] = useFetch("get_pages");
  const [updatePageFetch,updatePageSignal] = useFetch("update_page");

  useEffect(() => {
    pageSignal({});
  }, [])

  useEffect(() => {
    if (pageFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not load fragnets', detail:pageFetch!.error, life:3000});
    } else {
      const pages = pageFetch?.body ?? [];

      const create_children = (key: string, parent: string) => {
        return pages.filter((itm:any) => itm.parent === parent).map((itm:any) => {
          return {
            key: key + '~' + itm.id,
            icon: itm.icon,
            label: itm.name,
            data: itm,
            children: create_children(key + '~' + itm.id, itm.id),
          };
        });
      };

      setNodes(pages.filter((itm:any) => itm.parent === '').map((itm:any) => {
        return {
          key: itm.id,
          icon: itm.icon,
          label: itm.name,
          data: itm,
          children: create_children(itm.id, itm.id),
        };
      }));
    }
  }, [pageFetch]);

  useEffect(() => {
    if (updatePageFetch?.error) {
      toast.current.show({severity:'error', summary:'Could not update value', detail:updatePageFetch!.error, life:3000});
    }
  }, [updatePageFetch]);

  // lift up
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

  const publish = (newText:string) => {
    updatePageSignal({body: JSON.stringify({id:selectedKey, updateCol:"content", updateVal:newText})});

    setNodes((curNodes:any) => {
      let newNodes = JSON.parse(JSON.stringify(curNodes));
      const updatedNode = findNodeByKey(newNodes, selectedKey);
      updatedNode!.data!.content = newText;

      return newNodes;
    });
  }

  // lift up
  const nestedFilter = (items:any, cond:any) => items
    .map((item:any) => item.children
      ? {...item, children: nestedFilter(item.children, cond) }
      : item
    ).filter(cond);

  return (
    <>
    <Toast ref={toast} />
    <div style={{display:"flex"}}>
      <div style={{width:"300px", marginRight:"5px"}}>
        <Button label="Add Page"/>
        <Button label={edit ? "Publish Page" : "Edit Page"} onClick={() => setEdit(!edit)} />
        <Tree value={nodes} selectionMode="single" selectionKeys={selectedKey}
          onSelectionChange={(e:any) => setSelectedKey(e.value)} />
      </div>

      <PageViewer page={nestedFilter(nodes, (item:any) => item.data.id === selectedKey)?.[0]?.data?.content ?? ''}
        edit={edit} onPublish={publish} />
    </div>
    </>
  );
};

export default PageContainer;
