import type React from 'react'

export type AccordionProps = {
  initialOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  open?: boolean
  children?: React.ReactNode
  className?: string
}

export type AccordionHeaderProps = {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

export type AccordionBodyProps = {
  children?: React.ReactNode
  className?: string
}
