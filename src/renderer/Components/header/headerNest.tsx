import React, { useState, ReactNode } from 'react';

export default function HeaderNest(props: {header: ReactNode, children: ReactNode}) {
  const [show, setShow] = useState<boolean>(false)

  return <>
    <span onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {props.header}

      <span className="header-nest" style={{display: show ? "" : "none"}}>
        {show && props.children}
      </span>
    </span>
  </>
}
