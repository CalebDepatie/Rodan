import React, { useEffect,  } from 'react';

import "./dropdown.scss";

function Dropdown<ItemType>(props:{id?: string, value:ItemType, options:ItemType[], optionValue?:string, optionLabel?:string, onChange?:(e:ChangeEvent)=>void,
    disabled?:boolean, className?:string, style?:{[key:string]: string}}) {

  return (
    <select id={props.id} tabIndex={-1} className={props.className} value={props.value}
      onChange={props.onChange} disabled={props.disabled} style={props.style} >
      {props.options?.map((opt:ItemType, idx:number) =>
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
