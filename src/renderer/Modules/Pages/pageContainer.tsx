import React, { useState, useRef, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import PageViewer from './pageViewer'

import { toast } from 'react-toastify'
import { Button, InputText, IconPicker, Modal, TreeList } from '../../Components'
import { useCache } from '../../Hooks'
import { fieldGen, findNodeByKey } from '../../Helpers'

import './pages.scss';

function PageContainer(props:{}) {
  const [ edit, setEdit ] = useState(false);
  const [ nodes, setNodes ] = useState<any>([]);
  const [ selectedKey, setSelectedKey ] = useState('');
  const [ showForm, setShowForm ] = useState(false);
  const [ form, setForm ] = useState<any>({});

  const [pages_cache, pages_signal] = useCache('pages-get', {})

  useEffect(() => {
    if (pages_cache.error != undefined) {
      toast.error("Could not load pages: " + pages_cache.error.message)
    }

    if (pages_cache.body != undefined) {
      setNodes(pages_cache.body)
    }
  }, [pages_cache])

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
        <div className='r-button-group'>
          <Button label="Add Page" onClick={() => setShowForm(true)}/>
          <Button label={edit ? "Publish Page" : "Edit Page"} onClick={() => setEdit(!edit)} />
        </div>
        <TreeList value={nodes} selectionKeys={selectedKey}
          style={{height:"calc(100vh - 119px)", overflowY:'scroll'}}
          onChange={(e:any) => setSelectedKey(e.value)} />
      </div>

      <PageViewer page={nodes.reduce(flatten, [])
                            .filter((item:any) => item.key === selectedKey)?.[0]?.data?.content ?? ''}
        edit={edit} onPublish={publish} className='r-pages' />
    </div>

    <Modal header="Create a Page" visible={showForm} onHide={()=>setShowForm(false)} style={{width: '70vw'}} footer={(
      <>
        <Button label='Submit' className='r-button-success' onClick={(e:any) => {
          ipcRenderer.invoke('pages-create', {...form, parent: selectedKey.split('~')[selectedKey.split('~').length-1]})
            .then(res => {
              if (res.error != undefined) {
                toast.error("Could not create page: " + res.error.message)
                return
              }
              pages_signal()
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
          <InputText id="parent" type="text" disabled={true} value={pageName}/>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default PageContainer;
