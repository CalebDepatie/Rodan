import React from 'react';

import Row from "./row";

import './table.scss';

function Ledger(props:{columns:JSX.Element[], children?: any}) {

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
