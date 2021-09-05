import React from 'react';

import './button.scss';

function Button(props:{label?:string, icon?:string, className?:string, disabled?:boolean,
    onClick?:(e:any)=>void, style?:{[key:string]: string}, children?:React.ReactNode}) {

  const disabled:boolean = props.disabled ?? false;
  const className:string = (props.className ?? 'r-button-primary')
                            + ((disabled) ? ' disabled' : ' ');

  const label = props.label ? <span>{props.label}</span> : null;
  const icon  = props.icon ? <span className={props.icon} /> : null;

  return (
    <button className={className} disabled={disabled} onClick={props.onClick} style={props.style}>
      {icon}
      {label}
      {props.children}
    </button>
  );
};

export default Button;
