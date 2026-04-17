import { memo, useCallback, useEffect, useMemo, useRef, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from 'Components'
import { useGetScopeByCreator } from 'JansConfigApi'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { SPONTANEOUS_SCOPE_TYPE } from '../constants'
import { useStyles } from './styles/ClientShowSpontaneousScopes.style'
import type { ClientShowSpontaneousScopesProps } from '../types'

const ClientShowSpontaneousScopes = ({
  handler,
  isOpen,
  clientInum,
}: ClientShowSpontaneousScopesProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })

  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const { data: scopesByCreator, isLoading } = useGetScopeByCreator(clientInum ?? '', {
    query: { enabled: !!clientInum && isOpen },
  })

  const printableScopes = useMemo(
    () => (scopesByCreator ?? []).filter((item) => item.scopeType === SPONTANEOUS_SCOPE_TYPE),
    [scopesByCreator],
  )

  useEffect(() => {
    if (!isOpen) return
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.focus()
    return () => {
      previouslyFocusedRef.current?.focus()
    }
  }, [isOpen])

  const trapFocus = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  const handleOverlayKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handler()
      }
    },
    [handler],
  )

  const handleModalKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handler()
      }
      trapFocus(e)
    },
    [handler, trapFocus],
  )

  if (!isOpen) return null

  return createPortal(
    <GluuLoader blocking={isLoading}>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handler}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        ref={dialogRef}
        className={`${commitClasses.modalContainer} ${classes.modalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="spontaneous-scopes-title"
      >
        <button
          type="button"
          onClick={handler}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <i className="fa fa-times" aria-hidden="true" />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="spontaneous-scopes-title">
            {t('fields.spontaneousScopes')}
          </GluuText>
          <div className={classes.scopeList}>
            {printableScopes.length > 0 ? (
              printableScopes.map((scope, key) => (
                <div key={scope.inum ?? `spontaneous-${key}`}>
                  <Badge className={classes.badge}>{scope?.id}</Badge>
                </div>
              ))
            ) : (
              <GluuText variant="p" className={commitClasses.description} disableThemeColor>
                {t('messages.no_scope_in_spontaneous_client')}
              </GluuText>
            )}
          </div>
        </div>
      </div>
    </GluuLoader>,
    document.body,
  )
}

export default memo(ClientShowSpontaneousScopes)
