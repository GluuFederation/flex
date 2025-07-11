import React from 'react'

export interface UncontrolledTabsContextType {
  setActiveTabId: (tabId: string) => void
  activeTabId: string | null
}

const defaultContext: UncontrolledTabsContextType = {
  setActiveTabId: () => {},
  activeTabId: null,
}

const { Provider, Consumer } = React.createContext<UncontrolledTabsContextType>(defaultContext)

export { Provider, Consumer }
