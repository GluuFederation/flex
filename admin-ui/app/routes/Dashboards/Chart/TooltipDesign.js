import React from 'react'
import { useTranslation } from 'react-i18next'

function TooltipDesign({ payload }) {
  const { t } = useTranslation()
  let objValues = {
    client_credentials_access_token_count:
    t('tooltips.client_credentials_access_token_count'),
    authz_code_access_token_count: t('tooltips.authz_code_access_token_count'),
    authz_code_idtoken_count: t('tooltips.authz_code_idtoken_count'),
  }
  return (
    <div className="bg-white thumbnail p-2">
      {payload.length &&
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
