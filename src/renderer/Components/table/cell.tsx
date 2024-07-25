import React, { useState, ReactNode } from 'react';

import './table.scss';

interface CellProps {
  className?: string;
  editor?: ReactNode;
  style?: { [key: string]: string };
  children?: ReactNode;
}

function Cell(props: CellProps) {

  const [isActive, setActive] = useState(false);

  const handleBlur = (e:any) => {
    if (!e.currentTarget.contains(e.relatedTarget) || e.relatedTarget == null) {
        setActive(false)
    } else if (e.currentTarget.contains(e.relatedTarget)) {
      e.relatedTarget.onblur = handleBlur
    }
  }

  return (
    <div className={props.className ?? 'r-table-content'} style={props.style}
      onFocus={()=>setActive(true)} onBlur={handleBlur}>
      {(isActive && props.editor != undefined)
        ? <props.editor />
        : props.children}
    </div>
  );
};

Cell.defaultProps = {

};

export default Cell
