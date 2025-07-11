import React from 'react'
import times from 'lodash/times'
import { Card, CardBody, CardFooter, Button, CardHeader } from 'Components'

import { InfoPopover } from './InfoPopover'

interface CardRgbaColorProps {
  cardClass?: string
  color: string
}

const CardRgbaColor: React.FC<CardRgbaColorProps> = ({
  cardClass = '',
  color = 'Waiting for Data...',
}) => (
  <Card type="border" color={null} className={`mb-3 ${cardClass}`}>
    {times(9, (index) => {
      let Tag: React.ElementType = CardFooter
      Tag = index === 0 ? CardHeader : CardBody
      Tag = index === 8 ? CardFooter : CardBody
      const colorId = `${color}-0${index + 1}`
      return (
        <Tag className={`d-flex justify-content-center b-0 bg-${colorId}`} key={index}>
          <InfoPopover
            className="h6 text-inverse p-1 mb-0"
            colorId={colorId}
            tag={Button}
            color="link"
          >
            {colorId}
            <i className="fa fa-angle-up ms-1"></i>
          </InfoPopover>
        </Tag>
      )
    })}
  </Card>
)

export { CardRgbaColor }
