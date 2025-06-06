
import React from 'react'
import { TabContent } from 'reactstrap'

import { Consumer } from './context'

const UncontrolledTabsTabContent = (props: any) => (
  <Consumer>
    {
      (value) => (
        <TabContent { ...props } activeTab={ value.activeTabId } />
      )
    }
  </Consumer>
)

export { UncontrolledTabsTabContent }