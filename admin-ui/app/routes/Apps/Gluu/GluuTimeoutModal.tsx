import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { handleApiTimeout } from 'Redux/features/initSlice'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { Close } from '@/components/icons'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import { useStyles } from './styles/GluuTimeoutModal.style'
import GluuText from './GluuText'
import GluuThemeFormFooter from './GluuThemeFormFooter'

const GluuTimeoutModal = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { isTimeout } = useAppSelector((state) => state.initReducer)
  const { authServerHost } = useAppSelector((state) => state.authReducer.config)
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })

  const handleRefresh = useCallback(() => {
    dispatch(handleApiTimeout({ isTimeout: false }))
    const host = authServerHost ? `${authServerHost}/admin` : null
    if (host) {
      window.location.href = host
    } else {
      window.location.reload()
    }
  }, [authServerHost, dispatch])

  const handler = useCallback(() => {
    dispatch(handleApiTimeout({ isTimeout: false }))
  }, [dispatch])

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handler()
      }
    },
    [handler],
  )

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handler()
      }
      e.stopPropagation()
    },
    [handler],
  )

  if (!isTimeout) return null

  const modalContent = (
    <>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handler}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        className={`${commitClasses.modalContainer} ${classes.modalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="timeout-modal-title"
      >
        <button
          type="button"
          onClick={handler}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="timeout-modal-title">
            {t('messages.request_timeout_title')}
          </GluuText>
          <GluuText variant="p" className={classes.description}>
            {t('messages.request_timeout_description')}
          </GluuText>
          <GluuThemeFormFooter
            showApply
            applyButtonType="button"
            applyButtonLabel={t('actions.try_again')}
            onApply={handleRefresh}
          />
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default GluuTimeoutModal
