import React from 'react'

import { Remark } from 'react-remark'

import remarkGfm from 'remark-gfm';
import rehypeMermaid from 'rehype-mermaid';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownProps {
    children: string;
    className?: string;
}

function Markdown(props: MarkdownProps) {

    const remarkPlugins = [
        // remarkGfm
    ]

    const rehypePlugins = [
        rehypeSanitize,
        rehypeMermaid,
        rehypeHighlight
    ]

    return <div className={props.className}>
        <Remark
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}>
            {props.children}
        </Remark>
    </div>
}

export default Markdown