import React, { useState } from 'react';

import PageViewer from './pageViewer';

import { Tree } from 'primereact/tree';
import { Button } from '../../Components';

function PageContainer(props:{}) {
  const [ edit, setEdit ] = useState(false);

  return (
    <div style={{display:"flex"}}>
      <div style={{width:"300px", marginRight:"5px"}}>
        <Button label="Add Page"/>
        <Button label={edit ? "Publish Page" : "Edit Page"} onClick={() => setEdit(!edit)} />
        <Tree>

        </Tree>
      </div>

      <PageViewer page={"test *bold test*"} edit={edit} />
    </div>
  );
};

export default PageContainer;
