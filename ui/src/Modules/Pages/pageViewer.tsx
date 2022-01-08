import React from 'react';

import ReactMarkdown from 'react-markdown';
import { InputTextarea } from 'primereact/inputtextarea';

function PageViewer(props:{page:string, edit:boolean}) {

  return ( <>
    { props.edit ? <InputTextarea autoResize value={props.page} />
      : <ReactMarkdown>{props.page}</ReactMarkdown>
    } </>
  );

};

export default PageViewer;
