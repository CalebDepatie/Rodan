import React, { ReactNode } from 'react'

import './tabview.scss'

interface TabPanelProps {
  header: string;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: { [key: string]: string };
}

function TabPanel(props: TabPanelProps) {
  return (
    <div>
      {props.children}
    </div>
  )
}

TabPanel.defaultProps = {

}

export default TabPanel
