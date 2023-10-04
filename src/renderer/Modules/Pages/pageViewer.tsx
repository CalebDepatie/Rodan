import React, { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import { InputTextArea } from '../../Components';

function PageViewer(props:{page:string, edit:boolean, onPublish:any, className:string}) {
  const [ editedText, setEditedText ] = useState(props.page);
  const [ prevVal, setPrevVal ] = useState<boolean|null>(null);

  // counteract the anti-pattern
  useEffect(() => {
    setEditedText(props.page);
  }, [props.page]);

  useEffect(() => {
    if (!props.edit && prevVal === true) {
      props?.onPublish(editedText);
    }

    setPrevVal(props.edit);
  }, [props.edit]);

  return ( <>
    { props.edit ? <InputTextArea value={editedText}
        onChange={(e:any) => setEditedText(e.target.value)} className={props.className} />
      : <ReactMarkdown className={props.className}>{props.page}</ReactMarkdown>
    } </>
  );

};

export default PageViewer;
