import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import customColors, { hexToRgb } from '@/customColors'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { TooltipDesignProps } from '../types'
import { formatTooltipValue } from './utils'
import { useStyles } from './TooltipDesign.style'

const TooltipDesignComponent: React.FC<TooltipDesignProps> = ({
  payload = [],
  active,
  backgroundColor = customColors.white,
  textColor = customColors.primaryDark,
  isDark = false,
  formatter,
}) => {
  const { t } = useTranslation()

  const labelMap: Record<string, string> = {
    client_credentials_access_token_count: t('tooltips.client_credentials_access_token_count'),
    authz_code_access_token_count: t('tooltips.authz_code_access_token_count'),
    authz_code_idtoken_count: t('tooltips.authz_code_idtoken_count'),
    mau: t('fields.monthly_active_users'),
    clientCredentials: t('fields.cc_tokens'),
    authzCodeAccess: t('dashboard.authorization_code_access_token'),
    authzCodeId: t('dashboard.authorization_code_id_token'),
  }

  const borderColor = isDark
    ? `rgba(${hexToRgb(customColors.white)}, 0.2)`
    : `rgba(${hexToRgb(customColors.black)}, 0.1)`
  const shadowColor = `rgba(${hexToRgb(customColors.black)}, 0.25)`

  const { classes } = useStyles()

  if (!active || payload.length === 0) return null

  return (
    <div
      className={`thumbnail ${classes.tooltip}`}
      style={{
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        boxShadow: `0px 4px 16px 0px ${shadowColor}`,
      }}
    >
      {payload.map((item, idx) => {
        const dataKey = String(item.dataKey ?? '')
        const label = labelMap[dataKey] || (item.payload?.name ?? item.name) || dataKey
        const rawValue = item.payload?.[dataKey] ?? item.value ?? null
        const normalizedValue: string | number | boolean | null = Array.isArray(rawValue)
          ? String(rawValue)
          : (rawValue as string | number | boolean | null)
        const displayValue = formatter
          ? formatter(normalizedValue)
          : formatTooltipValue(normalizedValue)
        const isSpaced = payload.length > 1 && idx !== payload.length - 1
        return (
          <div
            key={`${dataKey}-${idx}`}
            className={`${classes.item} ${isSpaced ? classes.itemSpaced : ''}`}
          >
            <GluuText variant="span" className={classes.itemLabel}>
              {`${label}: ${displayValue}`}
            </GluuText>
          </div>
        )
      })}
    </div>
  )
}

const TooltipDesign = memo(TooltipDesignComponent)
TooltipDesign.displayName = 'TooltipDesign'

export default TooltipDesign
