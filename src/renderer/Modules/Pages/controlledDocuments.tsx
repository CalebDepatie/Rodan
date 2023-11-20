import React, { useState, useMemo, useEffect } from 'react'

import { ipcRenderer } from 'electron'
import { toast } from 'react-toastify'

import { useCache } from '../../Hooks'
import { Button, List, Dropdown, BoxOptions } from '../../Components'

import EditorPane from './editorPane'
import { stat } from 'fs'

function ControlledDocuments(props:{}) {
    const [documents, refreshDocuments] = useCache("docs-get", {})

    const [selectedGroup, setSelectedGroup] = useState<string>("Template")

    const [selectedDocument, setSelectedDocument] = useState<string>("")
    const [content, setContent] = useState<string>("")

    useEffect(() => {
        const doc = documents?.body?.controlled_docs?.find((doc: any) => doc.name === selectedDocument)
        
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

        setSelectedDocument(group_docs[0].name)

        return group_docs;
    }, [documents, selectedGroup])

    const statuses = useMemo(() => {
        if (!documents?.body?.controlled_docs) return [];

        const doc = documents?.body?.controlled_docs?.find((doc: any) => doc.name === selectedDocument)

        if (!doc) return [];

        const s = doc.revisions.map((rev: any) => ({
            label: "REV " + rev.version,
            value: rev.version
        }))

        return [...s, { label: "Working Copy", value: "current" }]

    }, [documents, selectedDocument])

    const newDocument = async (e: React.MouseEvent) => {
        await saveDocument()
    }

    const saveDocument = async () => {

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
                    <Button label="New Document" onClick={newDocument}/>
                </div>

                <List value={group} optionLabel="name" optionValue="name" 
                    selectionKeys={selectedDocument} onChange={documentChanged}/>
            </div>

            <div style={{width:"75%"}}>
                <EditorPane style={{height:"calc(100% - 36px)"}} value={content} onChange={(e) => setContent(e.target.value)} />

                <BoxOptions value="current" labels={statuses} />
            </div>
        </div>
    </>
}



export default ControlledDocuments