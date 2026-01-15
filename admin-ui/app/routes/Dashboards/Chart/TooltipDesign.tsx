import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { fontFamily, fontSizes } from '@/styles/fonts'
import type { TooltipDesignProps, ChartDataKey } from '../types'

const TooltipDesign = memo(({ payload = [] }: TooltipDesignProps) => {
  const { t } = useTranslation()

  const labelMap: Record<ChartDataKey, string> = {
    client_credentials_access_token_count: t('tooltips.client_credentials_access_token_count'),
    authz_code_access_token_count: t('tooltips.authz_code_access_token_count'),
    authz_code_idtoken_count: t('tooltips.authz_code_idtoken_count'),
  }

  if (payload.length === 0) return null

  return (
    <div className="bg-white thumbnail p-2">
      {payload.map((item) => {
        const label = labelMap[item.dataKey as ChartDataKey] || item.dataKey
        const value = item.payload[item.dataKey]
        return (
          <div key={item.dataKey} style={{ fontFamily, fontSize: fontSizes.sm }}>
            {label} : {value}
          </div>
        )
      })}
    </div>
  )
})

TooltipDesign.displayName = 'TooltipDesign'

export default TooltipDesign
