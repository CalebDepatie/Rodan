import React, { useState, useRef, useEffect } from 'react';

import { useFetch } from '../../Hooks';

import PageViewer from './pageViewer';

import { toast } from 'react-toastify';
import { Tree } from 'primereact/tree';
import TreeNode from 'primereact/treenode';
import { Dialog } from 'primereact/dialog';
import { Button, InputText } from '../../Components';

import './pages.scss';

function PageContainer(props:{}) {
  const [ edit, setEdit ] = useState(false);
  const [ nodes, setNodes ] = useState<any>([]);
  const [ selectedKey, setSelectedKey ] = useState('');
  const [ showForm, setShowForm ] = useState(false);
  const [ form, setForm ] = useState<any>({});

  const [ pageFetch, pageSignal ] = useFetch("get_pages");
  const [updatePageFetch,updatePageSignal] = useFetch("update_page");
  const [createPageFetch, createPageSignal] = useFetch("create_page");

  useEffect(() => {
    pageSignal({});
  }, [])

  useEffect(() => {
    if (pageFetch?.error) {
      toast.error('Could not Load Pages, ' + pageFetch!.error, {});
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
      toast.error('Could not update page, ' + updatePageFetch!.error, {});
    }
  }, [updatePageFetch]);

  useEffect(() => {
    if (createPageFetch?.error) {
      toast.error('Could not create page, ' + createPageFetch!.error, {});
    } else {
      toast.success('New Page created');
      setForm({})
    }
  }, [createPageFetch]);

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
    const id = selectedKey.split('~')[selectedKey.split('~').length-1];
    updatePageSignal({body: JSON.stringify({id:id, updateCol:"content", updateVal:newText})});

    setNodes((curNodes:any) => {
      let newNodes = JSON.parse(JSON.stringify(curNodes));
      const updatedNode = findNodeByKey(newNodes, selectedKey);
      updatedNode!.data!.content = newText;

      return newNodes;
    });
  }

  const formText = (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm({...form, [field]: e.target.value})
    };
  };

  const flatten = (acc:any, cur:any) => {
    return cur.children ? [...acc, cur, ...cur.children.reduce(flatten, [])]
                        : [...acc, cur];
  };

  return (
    <>
    <div style={{display:"flex"}}>
      <div style={{width:"300px", marginRight:"5px"}}>
        <Button label="Add Page" onClick={() => setShowForm(true)}/>
        <Button label={edit ? "Publish Page" : "Edit Page"} onClick={() => setEdit(!edit)} />
        <Tree value={nodes} selectionMode="single" selectionKeys={selectedKey}
          style={{height:"calc(100vh - 126px)"}}
          onSelectionChange={(e:any) => setSelectedKey(e.value)} />
      </div>

      <PageViewer page={nodes.reduce(flatten, [])
                            .filter((item:any) => item.key === selectedKey)?.[0]?.data?.content ?? ''}
        edit={edit} onPublish={publish} className='r-pages' />
    </div>

    <Dialog header="Create a Page" visible={showForm} onHide={()=>setShowForm(false)} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          createPageSignal({body: JSON.stringify({...form, parent: selectedKey.split('~')[selectedKey.split('~').length-1]})});
        }} />
      </>
    )}>
      <div className='r-form'>
        <div className="r-field r-col-6">
          <label htmlFor="name">Name</label>
          <InputText id="name" type="text" {...formText('name')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="icon">Icon <i className={form['icon']} /></label>
          <InputText id="icon" type="text" {...formText('icon')}/>
        </div>

        <div className="r-field r-col-6">
          <label htmlFor="parent">Parent</label>
          <InputText id="parent" type="text" disabled={true} value={selectedKey}/>
        </div>
      </div>
    </Dialog>
    </>
  );
};

export default PageContainer;
