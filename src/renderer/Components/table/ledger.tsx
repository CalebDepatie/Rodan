import React, { ReactNode } from 'react';

import Row from "./row";

import './table.scss';

function Ledger(props:{columns:ReactNode[], children?: ReactNode}) {

  return (
    <div>
      <Row className='r-table-header' data={props.columns} />

      {props.children}
    </div>
  );
};

Ledger.defaultProps = {

};

export default Ledger
