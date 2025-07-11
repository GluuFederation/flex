import React from 'react'
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import { useTranslation } from 'react-i18next'

export const POPOVER_BODY_PARTS = [
  '.text-',
  '.bg-',
  '.b-',
  '.bl-',
  '.br-',
  '.bt-',
  '.bb-',
  '.by-',
  '.bx-',
  '.btn-',
] as const

interface InfoPopoverProps {
  colorId: string
  children: React.ReactNode
  className?: string
  tag?: any
  [key: string]: any
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({
  colorId,
  children,
  className,
  tag: Tag = 'a',
  ...otherProps
}) => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <Tag color="link" id={`color-popover--${colorId}`} className={className} {...otherProps}>
        {children}
      </Tag>
      <UncontrolledPopover target={`color-popover--${colorId}`} placement="top">
        <PopoverHeader>
          {t('Color Options for') + ' '} {colorId}
        </PopoverHeader>
        <PopoverBody>
          {POPOVER_BODY_PARTS.map((partText, index) => (
            <span className="me-1" key={index}>{`${partText}${colorId}`}</span>
          ))}
        </PopoverBody>
      </UncontrolledPopover>
    </React.Fragment>
  )
}
