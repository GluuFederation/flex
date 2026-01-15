import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { fontFamily, fontSizes } from '@/styles/fonts'
import customColors from '@/customColors'
import type { TooltipDesignProps, ChartDataKey } from '../types'

const TooltipDesign = memo(
  ({
    payload = [],
    backgroundColor = customColors.white,
    textColor = customColors.primaryDark,
  }: TooltipDesignProps) => {
    const { t } = useTranslation()

    const labelMap: Record<ChartDataKey, string> = {
      client_credentials_access_token_count: t('tooltips.client_credentials_access_token_count'),
      authz_code_access_token_count: t('tooltips.authz_code_access_token_count'),
      authz_code_idtoken_count: t('tooltips.authz_code_idtoken_count'),
    }

    if (payload.length === 0) return null

    const isDarkTheme = textColor === customColors.white
    const borderColor = isDarkTheme
      ? customColors.tooltipBorderDark
      : customColors.tooltipBorderLight
    const shadowColor = customColors.shadowTooltip

    return (
      <div
        className="thumbnail p-2"
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
        {payload.map((item) => {
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
                marginBottom:
                  payload.length > 1 && item !== payload[payload.length - 1] ? '8px' : '0',
              }}
            >
              <span style={{ fontWeight: 600 }}>{label}</span> : {value}
            </div>
          )
        })}
      </div>
    )
  },
)

TooltipDesign.displayName = 'TooltipDesign'

export default TooltipDesign
