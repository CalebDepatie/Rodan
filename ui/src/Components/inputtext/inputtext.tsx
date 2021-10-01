import React from 'react';

import "./inputtext.scss";

function InputText(props:{value:any, onChange?:(e:any)=>void, type?:string, id?:string,
    className?:string, disabled?:boolean, style?:{[key:string]: string}}) {

  const className = props.className + (props.disabled ? ' disabled' : '');

  return (
    <input value={props.value} type={props.type}  onChange={props.onChange} id={props.id}
      className={className} disabled={props.disabled} style={props.style} />
  );
};

InputText.defaultProps = {
  disabled: false,
  type: 'text',
  className: 'r-inputtext'
};

export default InputText;
