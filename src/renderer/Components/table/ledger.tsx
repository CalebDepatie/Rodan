import React, { ReactNode } from 'react';

import Row from "./row";

import './table.scss';

interface LedgerProps {
  columns: ReactNode[];
  children?: ReactNode;
}

function Ledger(props: LedgerProps) {
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
