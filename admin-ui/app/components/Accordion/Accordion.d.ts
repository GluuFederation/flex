export interface AccordionProps {
  initialOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  open?: boolean
  children?: React.ReactNode
  className?: string
}

export interface AccordionHeaderProps {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

export interface AccordionBodyProps {
  children?: React.ReactNode
  className?: string
}

export interface AccordionIndicatorProps {
  open?: React.ReactNode
  closed?: React.ReactNode
  className?: string
}

export interface AccordionComponent extends FC<AccordionProps> {
  Header: FC<AccordionHeaderProps>
  Body: FC<AccordionBodyProps>
  Indicator: FC<AccordionIndicatorProps>
}

export const Accordion: AccordionComponent
