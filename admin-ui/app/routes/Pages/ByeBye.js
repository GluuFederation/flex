import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uuidv4 } from 'Utils/Util'
import { EmptyLayout, Label } from 'Components'
import { logoutUser } from 'Redux/features/logoutSlice'
import { useTranslation } from 'react-i18next'

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config)
  const token = useSelector((state) => state.authReducer.token.access_token)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    if (config) {
      const state = uuidv4()
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
      //const data = { token: token, token_type_hint: 'access_token' };
      let body = new FormData();
      body.append('token', token);
      body.append('token_type_hint', 'access_token');

      fetch('https://admin-ui-test.gluu.org/jans-auth/restv1/revoke', {
        method: 'POST',
        body
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

      window.location.href = sessionEndpoint
    }

    dispatch(logoutUser())
  }, [])

  return (
    <div className="fullscreen">
      <EmptyLayout.Section center>
        <Label style={{ fontSize: '2em', fontWeight: 'bold' }}>
          {t('Thanks for using the admin ui')}.
        </Label>
      </EmptyLayout.Section>
    </div>
  )
}

export default ByeBye
