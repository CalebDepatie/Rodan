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

interface TableProps<ItemType> {
  pk: string;
  columns: Column[];
  data: ItemType[];
  style?: {[key:string]: string};
}

function Table<ItemType>(props: TableProps<ItemType>) {

  const equalPercent = (100 / props.columns.length) + "%";

  return (
    <div className="r-table">
      <div className="r-table-top">{props.header}</div>
      <Ledger columns={props.columns.map((col:Column) => col.header)}>
        {
          props.data.map((row:ItemType) =>
            <>
              <Row key={row[props.pk]}>

                {props.columns.map((col:Column) =>
                  <Cell key={row[props.pk] + "-" + col.field}
                    style={{width: equalPercent, ...col.style}}
                    editor={(col.editor != undefined) ? () => <col.editor {...row} /> : undefined}>
                      {(col.body != undefined) ? <col.body {...row} />
                        : row?.[col.field]}
                  </Cell>
                )}
              </Row>
              <div className='r-table-fill' />
            </>
          )}
      </Ledger>
    </div>
  );
};

Table.defaultProps = {

};

export default Table
export { Column }
