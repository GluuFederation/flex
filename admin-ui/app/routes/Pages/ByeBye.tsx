import React, { useContext, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { uuidv4 } from 'Utils/Util'
import { EmptyLayout, Label } from 'Components'
import { logoutUser } from 'Redux/features/logoutSlice'
import { useTranslation } from 'react-i18next'
import { setAuthState } from '../../redux/features/authSlice'
import { deleteAdminUiSession as deleteSession } from 'Redux/api/backend-api'
import type { AuthConfig } from 'Redux/types'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { devLogger } from '@/utils/devLogger'

const EmptyLayoutSection = (
  EmptyLayout as React.ComponentType<{ children?: React.ReactNode }> & {
    Section: React.ComponentType<{ center?: boolean; children?: React.ReactNode }>
  }
).Section

const ByeBye = () => {
  const config = useAppSelector((state) => state.authReducer.config) as AuthConfig
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
          devLogger.error('Error deleting admin UI session:', error)
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
      <EmptyLayoutSection center>
        <Label style={{ fontSize: '2em', fontWeight: 'bold', color: themeColors.fontColor }}>
          {t('messages.thanks_for_using_admin_ui')}
        </Label>
      </EmptyLayoutSection>
    </div>
  )
}

export default ByeBye
