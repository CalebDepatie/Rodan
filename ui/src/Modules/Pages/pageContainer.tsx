import React from 'react';

import PageViewer from './pageViewer';

import { Tree } from 'primereact/tree';

function PageContainer(props:{}) {

  return (
    <div style={{display:"flex"}}>
      <Tree style={{width:"300px", marginRight:"5px"}}>

      </Tree>
      <PageViewer page={"test *bold test*"} />
    </div>
  );
};

export default PageContainer;
