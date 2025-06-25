import React from 'react'

interface AccordionContextType {
  isOpen: boolean
  onToggle: () => void
}
const { Provider, Consumer } = React.createContext<AccordionContextType>({
  isOpen: false,
  onToggle: () => {},
})

export { Provider, Consumer }
