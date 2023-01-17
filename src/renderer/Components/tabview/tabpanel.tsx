import React, { ReactNode } from 'react'

import './tabview.scss'

function TabPanel(props:{header:string, disabled?:boolean, children?:ReactNode,
  className?:string, style?:{[key:string]: string}}) {

  return (
    <div>
      {props.children}
    </div>
  )
}

TabPanel.defaultProps = {

}

export default TabPanel
