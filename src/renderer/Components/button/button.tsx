import React, { MouseEvent, ReactNode } from 'react';

import './button.scss';

function Button(props:{id?:string, label?:string, icon?:string, className?:string, disabled?:boolean,
    onClick?:(e:MouseEvent)=>void, style?:{[key:string]: string}, children?:ReactNode}) {

  const label = props.label ? <span>{props.label}</span> : null;
  const icon  = props.icon ? <span className={props.icon} /> : null;

  return (
    <button id={props.id} className={props.className} disabled={props.disabled} onClick={props.onClick} style={props.style}>
      {icon}
      {label}
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  className: 'r-button-primary'
}

export default Button;
