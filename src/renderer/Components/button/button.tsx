import React from 'react';

import './button.scss';

function Button(props:{label?:string, icon?:string, className?:string, disabled?:boolean,
    onClick?:(e:any)=>void, style?:{[key:string]: string}, children?:React.ReactNode}) {

  const label = props.label ? <span>{props.label}</span> : null;
  const icon  = props.icon ? <span className={props.icon} /> : null;

  return (
    <button className={props.className} disabled={props.disabled} onClick={props.onClick} style={props.style}>
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
