import React, { ReactNode, MouseEvent } from 'react';

import Cell from './cell';

import './table.scss';

interface RowProps<ItemType> {
  data: ItemType[];
  onClick?: (e: MouseEvent) => void;
  style?: { [key: string]: string };
  className?: string;
  children?: ReactNode;
}

function Row<ItemType>(props: RowProps<ItemType>) {

  const equalPercent = (100 / props.data.length) + "%";

  return (
    <div className={'r-table-row' + ' ' + (props.className ?? '')} onClick={props.onClick}>
      {props.children ??
        props.data.map((el:ItemType, idx:number) => <Cell key={idx} style={{width: equalPercent}}>{el}</Cell>)}
    </div>
  );
};

Row.defaultProps = {
  data: [],
  pk: "undefined"
};

export default Row
