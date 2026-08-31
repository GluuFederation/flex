import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { handleApiTimeout, handleSessionExpired } from 'Redux/features/initSlice'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { Close } from '@/components/icons'
import { ModalLayer } from '@/components/ModalLayer'
import { useStyles } from './styles/GluuTimeoutModal.style'
import GluuText from './GluuText'
import GluuThemeFormFooter from './GluuThemeFormFooter'
import { APP_BASE_URL } from '@/helpers/navigation'

// server to redirect /admin to /admin/. Exported because jsdom forbids stubbing window.location,
// so the URL is asserted here instead of through the navigation itself.
export const buildAdminUrl = (authServerHost?: string | number | boolean): string | null =>
  authServerHost ? `${authServerHost}${APP_BASE_URL}` : null

const GluuTimeoutModal = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { isTimeout, isSessionExpired } = useAppSelector((state) => state.initReducer)
  const { authServerHost } = useAppSelector((state) => state.authReducer.config)
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })

  const handleRefresh = useCallback(() => {
    dispatch(handleApiTimeout({ isTimeout: false }))
    dispatch(handleSessionExpired({ isSessionExpired: false }))
    const host = buildAdminUrl(authServerHost)
    if (host) {
      window.location.href = host
    } else {
      window.location.reload()
    }
  }, [authServerHost, dispatch])

  // A slow request can simply be dismissed and retried. An expired session cannot — there is
  // nothing behind the modal to go back to — so every dismissal there routes to sign-in.
  const handleDismiss = useCallback(() => {
    if (isSessionExpired) {
      handleRefresh()
      return
    }
    dispatch(handleApiTimeout({ isTimeout: false }))
  }, [dispatch, handleRefresh, isSessionExpired])

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleDismiss()
      }
      e.stopPropagation()
    },
    [handleDismiss],
  )

  if (!isTimeout && !isSessionExpired) return null

  const modalContent = (
    <ModalLayer onClose={handleDismiss}>
      <div
        className={classes.modalContainer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="timeout-modal-title"
      >
        <button
          type="button"
          onClick={handleDismiss}
          className={classes.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <GluuText variant="h2" className={classes.title} id="timeout-modal-title">
          {t(
            isSessionExpired ? 'messages.session_expired_title' : 'messages.request_timeout_title',
          )}
        </GluuText>
        <GluuText variant="p" className={classes.description}>
          {t(
            isSessionExpired
              ? 'messages.session_expired_description'
              : 'messages.request_timeout_description',
          )}
        </GluuText>
        <GluuThemeFormFooter
          className={classes.actions}
          showApply
          applyButtonType="button"
          applyButtonLabel={t('actions.refresh')}
          onApply={handleRefresh}
        />
      </div>
    </ModalLayer>
  )

  return createPortal(modalContent, document.body)
}

export default GluuTimeoutModal
