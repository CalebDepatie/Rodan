import React from 'react';

import "./dropdown.scss";

function Dropdown(props:{id?: string, value:any, options:any[], optionValue?:string, optionLabel?:string, onChange?:(e:any)=>void,
    disabled?:boolean, className?:string, valueTemplate?:any, itemTemplate?:any, style?:{[key:string]: string}}) {

  return (
    <select className={props.className} value={props.value} onChange={props.onChange} disabled={props.disabled} >
      {props.options.map((opt:any, idx:number) =>
        <option key={opt[props.optionValue!]}
          value={opt[props.optionValue!]}>{opt[props.optionLabel!]}</option>
      )}
    </select>
  )
};

Dropdown.defaultProps = {
  disabled: false,
  optionValue: 'value',
  optionLabel: 'label',
  className: 'r-dropdown'
};

export default Dropdown;
