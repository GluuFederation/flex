import React from 'react'

import { Provider } from './context'

// Define the props interface
interface UncontrolledTabsProps {
  children: React.ReactNode;
  initialActiveTabId?: string;
}

// Define the state interface
interface UncontrolledTabsState {
  activeTabId: string | null;
}

class UncontrolledTabs extends React.Component<UncontrolledTabsProps, UncontrolledTabsState> {
  constructor(props: UncontrolledTabsProps) {
    super(props)
    this.state = {
      activeTabId: this.props.initialActiveTabId || null
    }
  }

  render() {
    return (
      <Provider value={{
        setActiveTabId: (tabId: string) => { this.setState({ activeTabId: tabId }) },
        activeTabId: this.state.activeTabId
      }}>
        { this.props.children }
      </Provider> 
    )        
  }
}

export default UncontrolledTabs
