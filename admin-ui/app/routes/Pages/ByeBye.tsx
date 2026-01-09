// @ts-nocheck
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uuidv4 } from 'Utils/Util'
import { EmptyLayout, Label } from 'Components'
import { logoutUser } from 'Redux/features/logoutSlice'
import { useTranslation } from 'react-i18next'
import { setAuthState, deleteAdminUiSession } from '../../redux/features/authSlice'
import { deleteAdminUiSession as deleteSession } from 'Redux/api/backend-api'

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config)
  const hasSession = useSelector((state) => state.authReducer.hasSession)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    const performLogout = async () => {
      dispatch(setAuthState(false))

      // Delete admin UI session if it exists
      if (hasSession) {
        try {
          await deleteSession()
          dispatch(deleteAdminUiSession())
        } catch (error) {
          console.error('Error deleting admin UI session:', error)
        }
      }

      if (config && Object.keys(config).length > 0) {
        const state = uuidv4()
        const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
        dispatch(logoutUser())
        window.location.href = sessionEndpoint
      }
    }

    performLogout()
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
