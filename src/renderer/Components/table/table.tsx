import React from 'react';

import Ledger from './ledger';
import Row from './row';
import Cell from './cell';

import './table.scss';

interface Column {
  field: string;
  header: JSX.Element;
  body?: React.FC<any>;
  editor?: React.FC<any>;
  style?: {[key:string]: string};
}

function Table(props:{pk:string, columns:Column[], data:any[],
  style?:{[key:string]: string}}) {

  const equalPercent = (100 / props.columns.length) + "%";

  return (
    <div className="r-table">
      <div className="r-table-top">{props.header}</div>

      <Ledger columns={props.columns.map(col => col.header)}>

        {
          props.data.map(row =>
            <Row key={row[props.pk]}>
              {props.columns.map(col =>
                <Cell key={row[props.pk] + "-" + col.field}
                style={{width: equalPercent, ...col.style}}
                editor={(col.editor != undefined) ? () => <col.editor {...row} /> : undefined}>
                  {(col.body != undefined) ? <col.body {...row} />
                    : row?.[col.field]}
                </Cell>
              )}
            </Row>
          )
        }

      </Ledger>

    </div>
  );
};

Table.defaultProps = {

};

export default Table
export { Column }
