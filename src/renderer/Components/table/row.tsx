import React from 'react';

import Cell from './cell';

import './table.scss';

function Row(props:{data:any[], onClick?:(e:any)=>void,
    style?:{[key:string]: string}, className?:string, children?:any}) {

  const equalPercent = (100 / props.data.length) + "%";

  return (
    <div className={'r-table-row' + ' ' + (props.className ?? '')}>
      {props.children ??
        props.data.map(el => <Cell style={{width: equalPercent}}>{el}</Cell>)}
    </div>
  );
};

Row.defaultProps = {
  data: [],
};

export default Row
