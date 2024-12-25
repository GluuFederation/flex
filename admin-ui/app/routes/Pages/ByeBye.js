import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uuidv4 } from 'Utils/Util'
import { EmptyLayout, Label } from 'Components'
import { logoutUser } from 'Redux/features/logoutSlice'
import { useTranslation } from 'react-i18next'

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (config) {
      const state = uuidv4()
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
      
      // Redirect to logout endpoint
      window.location.href = sessionEndpoint
    }

    // Clear user session
    dispatch(logoutUser())

    // Prevent back navigation
    window.history.pushState(null, document.title, window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handlePopState = () => {
    // Prevent navigation
    window.history.pushState(null, document.title, window.location.href)
  }

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
