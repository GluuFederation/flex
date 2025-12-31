import React from 'react'
import { Badge } from 'Components'
import { useTranslation } from 'react-i18next'
import type { HealthStatusBadgeProps } from '../types'
import { STATUS_COLORS, STATUS_LABEL_KEYS, STATUS_BADGE_COLOR } from '../constants'

const DOT_STYLE: React.CSSProperties = {
  display: 'inline-block',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
}

const HealthStatusBadge: React.FC<HealthStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation()
  const badgeColor = STATUS_BADGE_COLOR[status]
  const label = t(STATUS_LABEL_KEYS[status])
  const dotColor = STATUS_COLORS[status]

  return (
    <Badge color={badgeColor} pill className="d-flex align-items-center gap-1">
      <span style={{ ...DOT_STYLE, backgroundColor: dotColor }} />
      {label}
    </Badge>
  )
}

export default HealthStatusBadge
