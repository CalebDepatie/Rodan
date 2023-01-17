import React, { ReactNode, useState } from 'react'

import TabPanel from './tabpanel'
import './tabview.scss'

function TabView(props:{children?:ReactNode, className?:string, style?:{[key:string]: string}}) {
  const [ activeTab, setActiveTab ] = useState(0)

  const createHeaders = () => {
    return React.Children.map(props.children,
      (tab:ReactNode, index:number) => {
        const className = 'r-tabview-header' + (activeTab===index ? ' active' : '')
        return (
          <div className={className} disabled={tab.props.disabled ?? false}
            onClick={() => setActiveTab(index)}>
            {tab.props.header}
          </div>
      )
    })
  }

  const getActiveContent = () => {
    const content = React.Children.toArray(props.children)
    return (
      <>
        {content[activeTab]}
      </>
    )
  }

  return (
    <div className={props.className} style={props.style}>
      <div className='r-tabview-header-row'>
        {createHeaders()}
      </div>
      {getActiveContent()}
    </div>
  )
}

TabView.defaultProps = {

}

export default TabView
