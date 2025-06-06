import React, { useState, useCallback } from 'react'
import { AccordionProps } from './Accordion.d'
import Card from './../Card'
import { Provider } from './context'

export function Accordion(props: AccordionProps) {
  const { className, children, initialOpen, open, onToggle, ...otherProps } = props

  // Error check (mimics constructor logic)
  if (typeof open !== 'undefined' && typeof onToggle === 'undefined') {
    throw new Error("Accordion: props.open has to be used combined with props.onToggle " +
      "use props.initialOpen to create an uncontrolled Accordion.")
  }

  // Uncontrolled state
  const [isOpenState, setIsOpenState] = useState(!!initialOpen)

  // Handler
  const toggleHandler = useCallback(() => {
    if (!onToggle) {
      setIsOpenState(prev => !prev)
    } else {
      onToggle(!open)
    }
  }, [onToggle, open])

  // Determine open state
  const isOpen = onToggle ? (open ?? false) : isOpenState

  return (
    <Provider
      value={{
        onToggle: toggleHandler,
        isOpen: isOpen
      }}
    >
      <Card className={className} type="border" color={null} {...otherProps}>
        {children}
      </Card>
    </Provider>
  )
}