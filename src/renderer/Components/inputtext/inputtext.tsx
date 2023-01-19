import React, { ChangeEvent } from 'react';

import "./inputtext.scss";

function InputText<ValueType>(props:{value:ValueType, onChange?:(e:ChangeEvent)=>void, type?:string, id?:string,
    className?:string, disabled?:boolean, style?:{[key:string]: string}}) {

  return (
    <input value={props.value} type={props.type} onChange={props.onChange} id={props.id}
      className={props.className} disabled={props.disabled} style={props.style} />
  );
};

InputText.defaultProps = {
  disabled: false,
  type: 'text',
  value: '',
  className: 'r-inputtext'
};

export default InputText;
