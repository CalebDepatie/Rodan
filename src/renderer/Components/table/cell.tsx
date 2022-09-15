import React from 'react';

import './table.scss';

function Cell(props:{className?:string, onClick?:(e:any)=>void,
    style?:{[key:string]: string}, children?:any}) {

  return (
    <div className={props.className ?? 'r-fin-content'} style={props.style} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

Cell.defaultProps = {

};

export default Cell
