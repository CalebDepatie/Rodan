import React, { useRef, useState, useEffect, ReactNode } from 'react';

import './status.scss';

interface StatusProps {
  id?: string;
  name?: string;
  description?: string;
  colour?: string;
  className?: string;
  style?: { [key: string]: string };
}

function Status(props: StatusProps) {

  const style = {...(props.style ?? {}), backgroundColor: `#${props.colour}`};

  return (
      <div className={props.className} style={style}>
          {props.name}
      </div>
  );
};

Status.defaultProps = {
  className: 'status'
};

export default Status
