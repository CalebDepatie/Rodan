import React, { useRef, useState, useEffect, ReactNode } from 'react';

import './status.scss';

import { Tooltip } from '../tooltip';

interface StatusProps {
  id?: string;
  name?: string;
  descrip?: string;
  colour?: string;
  className?: string;
  style?: { [key: string]: string };
}

function Status(props: StatusProps) {

  const style = {...(props.style ?? {}), backgroundColor: `#${props.colour}`};

  return (
    <Tooltip content={props.descrip}>
      <div className={props.className} style={style}>
          {props.name}
      </div>
    </Tooltip>
  );
};

Status.defaultProps = {
  className: 'status'
};

export default Status
