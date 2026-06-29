import { createContext } from 'react'
import type { AccordionContextType } from './types'

const AccordionContext = createContext<AccordionContextType>({
  isOpen: false,
  onToggle: () => {},
})

export { AccordionContext }
