import React, { useState, ReactNode } from 'react';


interface HeaderNestProps {
  header: ReactNode;
  children: ReactNode;
}

function HeaderNest(props: HeaderNestProps) {
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

HeaderNest.defaultProps = {
}

export default HeaderNest
