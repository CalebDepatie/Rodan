import React from 'react';

import "./inputtext.scss";

function InputText(props:{value:any, onChange?:(e:any)=>void, type?:string, id?:string,
    className?:string, disabled?:boolean, style?:{[key:string]: string}}) {

  const disabled  = props.disabled ?? false;
  const type      = props.type ?? 'text';
  const className = (props.className ?? 'r-inputtext')
                    + (disabled ? ' disabled' : '');

  return (
    <input value={props.value} type={type}  onChange={props.onChange} id={props.id}
      className={className} disabled={disabled} style={props.style} />
  );
};

export default InputText;
