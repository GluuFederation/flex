import type React from 'react'
import type { CollapseProps } from '@mui/material/Collapse'

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
  timeout?: CollapseProps['timeout']
}

export type AccordionContextType = {
  isOpen: boolean
  onToggle: () => void
}
