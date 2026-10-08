import { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { SESSION_EXPIRED } from '@/audit/messages'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { Close, RefreshIcon } from '@/components/icons'
import { ModalLayer } from '@/components/ModalLayer'
import { useStyles } from './styles/GluuTimeoutModal.style'
import GluuText from './GluuText'
import GluuThemeFormFooter from './GluuThemeFormFooter'

const GluuTimeoutModal = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const isSessionExpired = useAppSelector((state) => state.initReducer.isSessionExpired)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })

  const handleSignOut = useCallback(() => {
    if (isSigningOut) return
    setIsSigningOut(true)
    dispatch(auditLogoutLogs({ message: SESSION_EXPIRED }))
  }, [dispatch, isSigningOut])

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleSignOut()
      }
      e.stopPropagation()
    },
    [handleSignOut],
  )

  if (!isSessionExpired) return null

  const modalContent = (
    <ModalLayer onClose={handleSignOut}>
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
          onClick={handleSignOut}
          className={classes.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <GluuText variant="h2" className={classes.title} id="timeout-modal-title">
          {t('messages.session_expired_title')}
        </GluuText>
        <GluuText variant="p" className={classes.description}>
          {t('messages.session_expired_description')}
        </GluuText>
        <GluuThemeFormFooter
          className={classes.actions}
          showApply
          applyButtonType="button"
          applyButtonLabel={t('actions.refresh')}
          applyButtonIcon={<RefreshIcon fontSize="small" aria-hidden />}
          onApply={handleSignOut}
          isLoading={isSigningOut}
        />
      </div>
    </ModalLayer>
  )

  return createPortal(modalContent, document.body)
}

export default GluuTimeoutModal
