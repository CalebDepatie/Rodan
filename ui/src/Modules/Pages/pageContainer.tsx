import React from 'react';

import PageViewer from './pageViewer';

import { Tree } from 'primereact/tree';
import { Button } from '../../Components';

function PageContainer(props:{}) {

  return (
    <div style={{display:"flex"}}>
      <div style={{width:"300px", marginRight:"5px"}}>
        <Button label="Add Page"/>
        <Tree>

        </Tree>
      </div>

      <PageViewer page={"test *bold test*"} />
    </div>
  );
};

export default PageContainer;
