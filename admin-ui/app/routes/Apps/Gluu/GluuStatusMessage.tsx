import React from 'react'
import { Row, Col } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { customColors } from '@/customColors'

interface GluuStatusMessageProps {
  message: string
  type: 'loading' | 'error' | 'success' | 'info'
  labelSize?: number
  colSize?: number
  inline?: boolean
}

const GluuStatusMessage: React.FC<GluuStatusMessageProps> = ({
  message,
  type,
  labelSize = 4,
  colSize = 8,
  inline = false,
}) => {
  const getColorForType = () => {
    switch (type) {
      case 'loading':
      case 'info':
        return customColors.lightBlue
      case 'error':
        return customColors.accentRed
      case 'success':
        return customColors.lightGreen
      default:
        return customColors.lightBlue
    }
  }

  const messageContent = (
    <div
      style={{
        color: getColorForType(),
        fontSize: '0.875rem',
        marginTop: '0.25rem',
      }}
    >
      {message}
    </div>
  )

  if (inline) {
    return messageContent
  }

  return (
    <Row>
      <GluuLabel label="" size={labelSize} />
      <Col sm={colSize}>{messageContent}</Col>
    </Row>
  )
}

export default GluuStatusMessage
