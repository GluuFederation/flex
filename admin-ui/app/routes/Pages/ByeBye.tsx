import React, { useContext, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { uuidv4 } from 'Utils/Util'
import { EmptyLayout, Label } from 'Components'
import { logoutUser } from 'Redux/features/logoutSlice'
import { useTranslation } from 'react-i18next'
import { setAuthState } from '../../redux/features/authSlice'
import { deleteAdminUiSession as deleteSession } from 'Redux/api/backend-api'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'

function ByeBye() {
  const config = useAppSelector((state) => state.authReducer.config)
  const hasSession = useAppSelector((state) => state.authReducer.hasSession)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  useEffect(() => {
    const performLogout = async () => {
      dispatch(setAuthState({ state: false }))

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
  }, [])

  return (
    <div
      className="fullscreen"
      style={{ backgroundColor: themeColors.background, minHeight: '100vh' }}
    >
      <EmptyLayout.Section center>
        <Label style={{ fontSize: '2em', fontWeight: 'bold', color: themeColors.fontColor }}>
          {t('messages.thanks_for_using_admin_ui')}
        </Label>
      </EmptyLayout.Section>
    </div>
  )
}

export default ByeBye
