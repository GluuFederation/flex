import { Accordion as AccordionBase } from './Accordion'
import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'
import { AccordionIndicator } from './AccordionIndicator'

type AccordionComponent = typeof AccordionBase & {
  Body: typeof AccordionBody
  Header: typeof AccordionHeader
  Indicator: typeof AccordionIndicator
}

const Accordion = AccordionBase as AccordionComponent
Accordion.Body = AccordionBody
Accordion.Header = AccordionHeader
Accordion.Indicator = AccordionIndicator

export default Accordion
