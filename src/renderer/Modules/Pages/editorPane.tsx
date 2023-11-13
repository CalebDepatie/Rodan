import React from 'react'

import ReactMarkdown from 'react-markdown';

import { InputTextArea } from '../../Components'

interface EditorPaneProps {
    value: string;
    style?: React.CSSProperties;
    onChange?: (e: React.ChangeEvent) => void;
}

function EditorPane(props: EditorPaneProps) {
    const style = { 
        height: "calc(100% - 3px)",
        display: "flex",

        ...props.style 
    }

    return <>
        <div style={style}>
            <InputTextArea value={props.value} onChange={props.onChange} style={{width:"50%"}} />

            <div style={{width:"50%"}}>
                <ReactMarkdown>
                    {props.value}
                </ReactMarkdown>
            </div>
        </div>
    </>
}

export default EditorPane