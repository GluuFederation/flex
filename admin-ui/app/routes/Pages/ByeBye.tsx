// @ts-nocheck
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uuidv4 } from 'Utils/Util'
import { EmptyLayout, Label } from 'Components'
import { logoutUser } from 'Redux/features/logoutSlice'
import { useTranslation } from 'react-i18next'
import { setAuthState } from '../../redux/features/authSlice'
import { deleteAdminUiSession as deleteSession } from 'Redux/api/backend-api'

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config)
  const hasSession = useSelector((state) => state.authReducer.hasSession)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    const performLogout = async () => {
      dispatch(setAuthState(false))

      if (hasSession) {
        try {
          await deleteSession()
        } catch (error) {
          console.error('Error deleting admin UI session:', error)
        }
      }

      dispatch(logoutUser())

      if (config && Object.keys(config).length > 0 && config.endSessionEndpoint) {
        const state = uuidv4()
        const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
        window.location.href = sessionEndpoint
      } else {
        const fallbackUri = localStorage.getItem('postLogoutRedirectUri') || '/'
        window.location.href = fallbackUri
      }
    }

    performLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
