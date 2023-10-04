import React, { ChangeEvent, useEffect, useRef } from 'react';

import "./inputtextarea.scss";

function InputTextArea<ValueType>(props:{value:ValueType, onChange?:(e:ChangeEvent)=>void, id?:string,
    className?:string, disabled?:boolean, style?:{[key:string]: string}}) {

  return (
    <textarea value={props.value} onChange={props.onChange} id={props.id}
      className={props.className} disabled={props.disabled} style={props.style} />
  );
};

InputTextArea.defaultProps = {
  disabled: false,
  value: '',
  className: 'r-inputtextarea'
};

export default InputTextArea;
