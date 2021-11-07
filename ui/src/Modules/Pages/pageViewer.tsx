import React from 'react';

import ReactMarkdown from 'react-markdown';

function PageViewer(props:{page:string}) {

  return <ReactMarkdown>{props.page}</ReactMarkdown>;

};

export default PageViewer;
