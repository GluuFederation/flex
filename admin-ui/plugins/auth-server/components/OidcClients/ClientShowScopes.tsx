import React, { useCallback, useContext, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { GluuBadge } from '@/components/GluuBadge'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { useStyles } from './styles/ClientShowScopes.style'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { getClientScopeByInum } from '@/utils/Util'
import { useGetOauthScopes } from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ClientShowScopesProps } from './types'

const ClientShowScopes = ({
  handler,
  data,
  isOpen,
}: ClientShowScopesProps): React.ReactElement | null => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })

  const scopeInums = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }
    return data.map((scopeDn) => getClientScopeByInum(scopeDn)).filter(Boolean)
  }, [data])

  const {
    data: scopesResponse,
    isLoading,
    isFetching,
  } = useGetOauthScopes(
    {
      pattern: scopeInums.join(','),
    },
    {
      query: {
        enabled: isOpen && scopeInums.length > 0,
      },
    },
  )

  const loading = isLoading || isFetching
  const fetchedScopes: Scope[] = (scopesResponse?.entries as Scope[]) ?? []

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

  if (!isOpen) return null

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
        className={commitClasses.modalContainer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="client-scopes-title"
      >
        <button
          type="button"
          onClick={handler}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <i className="fa fa-times" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="client-scopes-title">
            {t('fields.scopes')}
          </GluuText>
          <div className={classes.scopesLoaderScope}>
            <GluuLoader blocking={loading}>
              <div className={classes.scopesBody}>
                {!loading && fetchedScopes.length > 0 && (
                  <div className={classes.scopesList}>
                    {fetchedScopes.map((scope, index) => (
                      <GluuBadge
                        key={scope.inum || scope.id || index}
                        size="md"
                        backgroundColor={themeColors.badges.filledBadgeBg}
                        textColor={themeColors.badges.filledBadgeText}
                        borderColor="transparent"
                        borderRadius={6}
                      >
                        {scope.displayName || scope.id}
                      </GluuBadge>
                    ))}
                  </div>
                )}
                {!loading && fetchedScopes.length === 0 && (
                  <GluuText variant="p">{t('messages.no_scope_in_client')}</GluuText>
                )}
              </div>
            </GluuLoader>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default ClientShowScopes
