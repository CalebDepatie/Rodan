import React from 'react'

import { InputTextArea, Markdown } from '../../Components'

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

            <div className="r-page-markdown" style={{width:"50%", overflowY: "scroll"}}>
                <Markdown>
                    {props.value}
                </Markdown>
            </div>
        </div>
    </>
}

export default EditorPane