import React, { useState, useRef, useEffect } from 'react'

import { ipcRenderer } from 'electron'
import { toast } from 'react-toastify'

import { useCache } from '../../Hooks'
import { Button, TreeList, Dropdown, BoxOptions } from '../../Components'

import EditorPane from './editorPane'

function ControlledDocuments(props:{}) {
    const [content, setContent] = useState<string>("")

    const templates = [
        {
            value: "whitepaper",
            label: "Whitepaper"
        },
        {
            value: "design_spec",
            label: "Design Specification"
        }
    ]

    const statuses = [
        {
            label: "REV 0",
            value: "0"
        },
        {
            label: "REV 1",
            value: "1"
        },
        {
            label: "REV 2",
            value: "2"
        },
        {
            label: "Working Copy",
            value: "current"
        }
    ]

    const newDocument = async (e: React.MouseEvent) => {

    }

    return <>
        <div style={{display: "flex", height:"100%"}}>
            <div style={{width:"25%"}}>
                <div>
                    <Dropdown value={""} options={templates} />
                    <Button label="New Document" onClick={newDocument}/>
                </div>

                {/* <TreeList /> */}
            </div>

            <div style={{width:"75%"}}>
                <EditorPane style={{height:"calc(100% - 36px)"}} value={content} onChange={(e) => setContent(e.target.value)} />

                <BoxOptions value="current" labels={statuses} />
            </div>
        </div>
    </>
}



export default ControlledDocuments