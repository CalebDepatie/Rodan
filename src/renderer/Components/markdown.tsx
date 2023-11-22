import React from 'react'

import ReactMarkdown from 'react-markdown'

interface MarkdownProps {
    children: string;
    className?: string;
}

export function Markdown(props: MarkdownProps) {

    return <>
    <ReactMarkdown className={props.className}>
        {props.children}
    </ReactMarkdown>
    </>
}