import React from 'react';

function Dropdown(props:{id?: string, value:any, options:any[], optionValue?:string, optionLabel?:string, onChange?:(e:any)=>void,
    disabled?:boolean, className?:string, valueTemplate?:any, itemTemplate?:any, style?:{[key:string]: string}}) {


  return (
    <select className={props.className}>
      {props.options.map((opt:any) => {
        return <option value={opt[props.optionValue!]}>{opt[props.optionLabel!]}</option>
      })}
    </select>
  )
};

Dropdown.defaultProps = {
  disabled: false,
  optionValue: 'value',
  optionLabel: 'id',
  className: 'r-dropdown'
};

export default Dropdown;
