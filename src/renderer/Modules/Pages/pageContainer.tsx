import React, { useState, useRef, useEffect } from 'react';
import { ipcRenderer } from 'electron';

import PageViewer from './pageViewer';

import { toast } from 'react-toastify';
import { Tree } from 'primereact/tree';
import TreeNode from 'primereact/treenode';
import { Dialog } from 'primereact/dialog';
import { Button, InputText, IconPicker } from '../../Components';
import { fieldGen, findNodeByKey } from '../../Helpers';

import './pages.scss';

function PageContainer(props:{}) {
  const [ edit, setEdit ] = useState(false);
  const [ nodes, setNodes ] = useState<any>([]);
  const [ selectedKey, setSelectedKey ] = useState('');
  const [ showForm, setShowForm ] = useState(false);
  const [ form, setForm ] = useState<any>({});

  const refresh = async () => {
    const res = await ipcRenderer.invoke('pages-get', {});

    if (res.error != undefined) {
      toast.error("Could not load pages: " + res.error.message)
    }

    setNodes(res.body);
  }

  useEffect(() => {
    refresh();
  }, [])

  const publish = async (newText:string) => {
    const id = selectedKey.split('~')[selectedKey.split('~').length-1];
    const res = await ipcRenderer.invoke('pages-update', {id:id, updateCol:"content", updateVal:newText});
    if (res.error != undefined) {
      toast.error("Could not update page: " + res.error.message)
      return
    }

    setNodes((curNodes:any) => {
      let newNodes = JSON.parse(JSON.stringify(curNodes));
      const updatedNode = findNodeByKey(newNodes, selectedKey);
      updatedNode!.data!.content = newText;

      return newNodes;
    });
  }

  const formText = fieldGen(form, setForm)

  const flatten = (acc:any, cur:any) => {
    return cur.children ? [...acc, cur, ...cur.children.reduce(flatten, [])]
                        : [...acc, cur];
  };

  const pageName = findNodeByKey(nodes, selectedKey)?.data?.name ?? ""

  return (
    <>
    <div style={{display:"flex"}}>
      <div style={{width:"300px", marginRight:"5px"}}>
        <Button label="Add Page" onClick={() => setShowForm(true)}/>
        <Button label={edit ? "Publish Page" : "Edit Page"} onClick={() => setEdit(!edit)} />
        <Tree value={nodes} selectionMode="single" selectionKeys={selectedKey}
          style={{height:"calc(100vh - 110px)", overflowY:'scroll'}}
          onSelectionChange={(e:any) => setSelectedKey(e.value)} />
      </div>

      <PageViewer page={nodes.reduce(flatten, [])
                            .filter((item:any) => item.key === selectedKey)?.[0]?.data?.content ?? ''}
        edit={edit} onPublish={publish} className='r-pages' />
    </div>

    <Dialog header="Create a Page" visible={showForm} onHide={()=>setShowForm(false)} position='center' modal style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          ipcRenderer.invoke('pages-create', {...form, parent: selectedKey.split('~')[selectedKey.split('~').length-1]})
            .then(res => {
              if (res.error != undefined) {
                toast.error("Could not create page: " + res.error.message)
                return
              }
              refresh()
              toast.success("Created Page");
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
          <label htmlFor="icon">Icon</label>
          <IconPicker id="icon" {...formText('icon')}/>
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
