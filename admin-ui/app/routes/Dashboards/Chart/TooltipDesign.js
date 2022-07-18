import React from 'react'

function TooltipDesign({ payload }) {
  let objValues = {
    client_credentials_access_token_count:
      'Client credentials access token count',
    authz_code_access_token_count: 'Authz code access token count',
    authz_code_idtoken_count: 'Authz code idtoken count',
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
