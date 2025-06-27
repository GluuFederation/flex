import React from 'react'
import { useTranslation } from 'react-i18next'

interface TooltipPayloadItem {
  dataKey: string
  payload: {
    [key: string]: any
  }
}

interface TooltipDesignProps {
  payload?: TooltipPayloadItem[]
}

const TooltipDesign: React.FC<TooltipDesignProps> = ({ payload }) => {
  const { t } = useTranslation()
  const objValues: { [key: string]: string } = {
    client_credentials_access_token_count:
    t('tooltips.client_credentials_access_token_count'),
    authz_code_access_token_count: t('tooltips.authz_code_access_token_count'),
    authz_code_idtoken_count: t('tooltips.authz_code_idtoken_count'),
  }
  return (
    <div className="bg-white thumbnail p-2">
      {payload?.length &&
        payload.map((item, key) => {
          return (
            <div key={key} style={{ fontSize: '12px' }}>
              {objValues[item.dataKey]} : {item.payload[item.dataKey]}
            </div>
          )
        })}
    </div>
  )
}

export default TooltipDesign
