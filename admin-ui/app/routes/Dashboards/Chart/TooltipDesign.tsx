import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { fontFamily, fontSizes } from '@/styles/fonts'
import customColors, { hexToRgb } from '@/customColors'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { TooltipDesignProps, ChartDataKey } from '../types'

const TooltipDesign = memo(
  ({
    payload = [],
    active,
    backgroundColor = customColors.white,
    textColor = customColors.primaryDark,
    isDark = false,
  }: TooltipDesignProps) => {
    const { t } = useTranslation()

    const labelMap: Record<ChartDataKey, string> = {
      client_credentials_access_token_count: t('tooltips.client_credentials_access_token_count'),
      authz_code_access_token_count: t('tooltips.authz_code_access_token_count'),
      authz_code_idtoken_count: t('tooltips.authz_code_idtoken_count'),
    }

    if (!active || payload.length === 0) return null

    const borderColor = isDark
      ? `rgba(${hexToRgb(customColors.white)}, 0.2)`
      : `rgba(${hexToRgb(customColors.black)}, 0.1)`
    const shadowColor = `rgba(${hexToRgb(customColors.black)}, 0.25)`

    return (
      <div
        className="thumbnail"
        style={{
          backgroundColor,
          color: textColor,
          borderRadius: '8px',
          boxShadow: `0px 4px 16px 0px ${shadowColor}`,
          border: `1px solid ${borderColor}`,
          padding: '12px 16px',
          minWidth: '200px',
        }}
      >
        {payload.map((item, idx) => {
          const label = labelMap[item.dataKey as ChartDataKey] || item.dataKey
          const value = item.payload[item.dataKey]
          return (
            <div
              key={item.dataKey}
              style={{
                fontFamily,
                fontSize: fontSizes.sm,
                color: textColor,
                fontWeight: 500,
                lineHeight: '1.5',
                marginBottom: payload.length > 1 && idx !== payload.length - 1 ? '8px' : '0',
              }}
            >
              <GluuText variant="span" style={{ fontWeight: 600 }}>
                {label}
              </GluuText>{' '}
              : {value}
            </div>
          )
        })}
      </div>
    )
  },
)

TooltipDesign.displayName = 'TooltipDesign'

export default TooltipDesign
