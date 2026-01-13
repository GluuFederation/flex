import React from 'react'
import { useTranslation } from 'react-i18next'
import { fontFamily, fontSizes } from '@/styles/fonts'
import type { TooltipDesignProps } from '../types'

const TooltipDesign = ({ payload = [] }: TooltipDesignProps) => {
  const { t } = useTranslation()
  const objValues: Record<string, string> = {
    client_credentials_access_token_count: t('tooltips.client_credentials_access_token_count'),
    authz_code_access_token_count: t('tooltips.authz_code_access_token_count'),
    authz_code_idtoken_count: t('tooltips.authz_code_idtoken_count'),
  }

  return (
    <div className="bg-white thumbnail p-2">
      {payload.length > 0 &&
        payload.map((item, key) => {
          return (
            <div key={key} style={{ fontFamily, fontSize: fontSizes.sm }}>
              {objValues[item.dataKey]} : {item.payload[item.dataKey]}
            </div>
          )
        })}
    </div>
  )
}

export default TooltipDesign
