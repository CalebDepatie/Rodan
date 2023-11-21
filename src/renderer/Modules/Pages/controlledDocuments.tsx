import React, { useState, useMemo, useEffect } from 'react'

import { ipcRenderer } from 'electron'
import { toast } from 'react-toastify'

import { useCache } from '../../Hooks'
import { Button, List, Dropdown, BoxOptions, Modal, InputText } from '../../Components'
import { fieldGen, fieldValGen } from '../../Helpers'

import EditorPane from './editorPane'

function ControlledDocuments(props:{}) {
    const [documents, refreshDocuments] = useCache("docs-get", {})

    const [selectedGroup, setSelectedGroup] = useState<string>("Template")
    const [selectedDocument, setSelectedDocument] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [newDocumentVisible, setNewDocumentVisible] = useState<boolean>(false)

    useEffect(() => {
        return () => {
            saveDocument()
        }
    }, [])

    useEffect(() => {
        const doc = documents?.body?.controlled_docs?.find((doc: any) => doc.id === selectedDocument)
        
        if (doc) {
            setContent(doc.content)
        }
    }, [selectedDocument])

    const templates = useMemo(() => {
        if (!documents?.body?.templates) return [];

        const types = documents?.body?.templates;

        return types.map((type: any) => ({
            value: type,
            label: type
        }));
    }, [documents])

    const group = useMemo(() => {
        if (!documents?.body?.controlled_docs) return [];

        const group_docs = documents!.body!.controlled_docs!.filter((doc: any) => doc.type === selectedGroup)

        return group_docs;
    }, [documents, selectedGroup])

    const statuses = useMemo(() => {
        if (!documents?.body?.controlled_docs) return [];

        const doc = documents?.body?.controlled_docs?.find((doc: any) => doc.id === selectedDocument)

        if (!doc) return [];

        const s = doc.revisions.map((rev: any) => ({
            label: "REV " + rev.version,
            value: rev.version
        }))

        return [...s, { label: "Working Copy", value: "current" }]

    }, [documents, selectedDocument])

    const newDocument = async (name: string, type: string) => {
        await saveDocument()

        const template = documents!.body!.controlled_docs!.find(
            (doc: any) => (doc.type === "Template") && (doc.name === type)
        )

        if (!template) {
            toast.error("Failed to create document")
            return;
        }

        const template_content = template.content
        
        const res = await ipcRenderer.invoke("docs-create", {
            content: template_content,
            name: name,
            type: type
        })

        if (res.error) {
            toast.error("Failed to create document " + res.error.message)
            return;
        }

        await refreshDocuments()
    }

    const saveDocument = async () => {
        if (content === group.find((doc: any) => doc.id === selectedDocument)?.content) return;

        await ipcRenderer.invoke("docs-update-content", {
            id: selectedDocument,
            content: content
        })

        await refreshDocuments()
    }

    const updateRev = async (e: React.MouseEvent) => {
        await saveDocument()
    }

    const templateChanged = async (e: React.ChangeEvent) => {
        await saveDocument()
        setSelectedGroup(e.target.value)
    }

    const documentChanged = async (e: React.ChangeEvent) => {
        await saveDocument()
        setSelectedDocument(e.value)
    }

    return <>
        <div style={{display: "flex", height:"100%"}}>
            <div style={{width:"25%"}}>
                <div>
                    <Dropdown value={selectedGroup} 
                        options={templates} onChange={templateChanged} />
                    <Button label="New Document" onClick={() => setNewDocumentVisible(true)}/>
                </div>

                <List value={group} optionLabel="name" optionValue="id" 
                    selectionKeys={selectedDocument} onChange={documentChanged}/>
            </div>

            <div style={{width:"75%"}}>
                <EditorPane style={{height:"calc(100% - 36px)"}} value={content} onChange={(e) => setContent(e.target.value)} />

                <BoxOptions value="current" labels={statuses} />
            </div>
        </div>

        <NewDocumentForm visible={newDocumentVisible} createDocument={newDocument}
            onHide={() => setNewDocumentVisible(false)} documentTypes={templates}/>
    </>
}

interface NewDocumentProps {
    visible: boolean;
    onHide: () => void;
    createDocument: (name: string, type: string) => void; 
    documentTypes: {value: string, label: string}[];
}

function NewDocumentForm(props: NewDocumentProps) {
    const [form, setForm] = useState<any>({doc_name:"", doc_type:""})

    const fieldVal = fieldValGen(form, setForm)
    const field = fieldGen(form, setForm)

    return <>
        <Modal header="Create New Document " onHide={props.onHide} 
            visible={props.visible} style={{width:"25%"}}
            footer={<Button label="Create Document" 
            onClick={() => props.createDocument(form["doc_name"], form["doc_type"])}/>}>

                <div style={{display: "box", width:"100%"}}>
                    <label htmlFor="doc_name">Document Name</label>
                    <InputText id='doc_name' {...field("doc_name")} />
                </div>

                <div style={{display: "box", width:"100%"}}>
                    <label htmlFor="doc_type">Document Type</label>
                    <Dropdown id="doc_type" options={props.documentTypes} style={{width:"100%"}}
                        {...field("doc_type")}/>
                </div>

        </Modal>
    </>
}



export default ControlledDocuments