import React, { ReactNode, useState } from 'react'

import './tabview.scss'

interface TabViewProps {
  children?: ReactNode;
  className?: string;
  style?: { [key: string]: string };
}

function TabView(props: TabViewProps) {
  const [ activeTab, setActiveTab ] = useState(0)

  const createHeaders = () => {
    return React.Children.map(props.children,
      (tab:ReactNode, index:number) => {
        const className = 'r-tabview-header' + (activeTab===index ? ' active' : '')
        const disabled = tab.props.disabled ?? false
        const onClick = disabled ? null : () => setActiveTab(index)
        return (
          <div className={className} disabled={disabled}
            onClick={onClick}>
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
