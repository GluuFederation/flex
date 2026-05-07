import { useState, useCallback } from 'react'
import { AccordionProps } from './Accordion.d'
import Card from './../Card'
import { Provider } from './context'

export const Accordion = (props: AccordionProps) => {
  const { className, children, initialOpen, open, onToggle, ...otherProps } = props

  if (typeof open !== 'undefined' && typeof onToggle === 'undefined') {
    throw new Error(
      'Accordion: props.open has to be used combined with props.onToggle ' +
        'use props.initialOpen to create an uncontrolled Accordion.',
    )
  }

  const [isOpenState, setIsOpenState] = useState(!!initialOpen)

  const toggleHandler = useCallback(() => {
    if (!onToggle) {
      setIsOpenState((prev) => !prev)
    } else {
      onToggle(!open)
    }
  }, [onToggle, open])

  const isOpen = onToggle ? (open ?? false) : isOpenState

  return (
    <Provider
      value={{
        onToggle: toggleHandler,
        isOpen: isOpen,
      }}
    >
      <Card className={className} type="border" {...otherProps}>
        {children}
      </Card>
    </Provider>
  )
}
