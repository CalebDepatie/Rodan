import React, { useState } from 'react';

import './table.scss';

function Cell(props:{className?:string, editor?:JSX.Element,
    style?:{[key:string]: string}, children?:any}) {

  const [isActive, setActive] = useState(false);

  const handleBlur = (e:any) => {
    if (!e.currentTarget.contains(e.relatedTarget) || e.relatedTarget == null) {
        setActive(false)
    }
  }

  return (
    <div tabIndex={1} className={props.className ?? 'r-table-content'} style={props.style}
      onFocus={()=>setActive(true)} onBlur={handleBlur}>
      {(isActive && props.editor != undefined) ? <props.editor />
        : props.children}
    </div>
  );
};

Cell.defaultProps = {

};

export default Cell
