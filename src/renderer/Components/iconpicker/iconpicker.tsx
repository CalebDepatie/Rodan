import React from 'react'
import { InputText } from '../'

import "./iconpicker.scss"

function IconPicker(props:{id?:string, value?:string, onChange?:(e:ChangeEvent)=>void,
    className?:string, disabled?:boolean, style?:{[key:string]: string}}) {

  return (
    <div className={props.className} style={props.style}>
      <InputText id={props.id} type="text" value={props.value} className='r-inputtext r-iconpicker-text'
        onChange={props.onChange} disabled={props.disabled} />

      <i className={'r-iconpicker-icon ' + props.value} />
    </div>
  )
}

IconPicker.defaultProps = {

}

export default IconPicker
