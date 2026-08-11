import React, { useMemo, useState, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import { Visibility, VisibilityOff } from '@/components/icons'
import { getGrantTypeLabel } from 'Plugins/auth-server/utils'
import { DOC_CATEGORY, LABELS, DOC_ENTRIES, CLIENT_SECRET_MASK } from '../constants'
import { useStyles } from './styles/ClientDetailPage.style'
import type { DisplayValue, ClientDetailPageProps, ClientSecretValueProps } from '../types'

const displayOrDash = (value: DisplayValue): string =>
  value === null || value === undefined || value === '' ? '—' : String(value)

const formatBadgeList = (items: string[] | undefined): string =>
  items?.length ? items.join(', ') : '—'

const ClientSecretValue: React.FC<ClientSecretValueProps> = memo(({ secret, themeColors }) => {
  const { t } = useTranslation()
  const { classes } = useStyles({ themeColors })
  const [isVisible, setIsVisible] = useState(false)

  const toggle = useCallback(() => setIsVisible((prev) => !prev), [])

  return (
    <span className={classes.secretRow}>
      <span className={classes.secretText}>{isVisible ? secret : CLIENT_SECRET_MASK}</span>
      <button
        type="button"
        className={classes.secretToggle}
        onClick={toggle}
        aria-label={t(isVisible ? 'password.hide' : 'password.show')}
      >
        {isVisible ? <Visibility /> : <VisibilityOff />}
      </button>
    </span>
  )
})
ClientSecretValue.displayName = 'ClientSecretValue'

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ row, scopes }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const labelStyle = useMemo(() => ({ color: themeColors.fontColor }), [themeColors.fontColor])

  const clientScopes = useMemo(() => {
    const scopesDns = row.scopes ?? []
    return scopes
      .filter((item) => scopesDns.includes(item.dn ?? '') && Boolean(item.id))
      .map((item) => item.id as string)
  }, [row.scopes, scopes])

  const description = useMemo(() => {
    if (row.description) return row.description
    const customAttrs = row.customAttributes ?? []
    const result = customAttrs.find((item) => item.name === 'description')
    return result?.values?.[0] || '—'
  }, [row.description, row.customAttributes])

  const displayName = useMemo(
    () => row.clientName || row.displayName || '—',
    [row.clientName, row.displayName],
  )
  const isEnabled = useMemo(() => !row.disabled, [row.disabled])

  const fields: GluuDetailGridField[] = useMemo(
    () => [
      {
        label: LABELS.CLIENT_ID,
        value: displayOrDash(row.inum),
        doc_entry: DOC_ENTRIES.CLIENT_ID,
        doc_category: DOC_CATEGORY,
      },
      {
        label: LABELS.CLIENT_SECRET,
        value: row.clientSecret ? undefined : '—',
        valueNode: row.clientSecret ? (
          <ClientSecretValue secret={row.clientSecret} themeColors={themeColors} />
        ) : undefined,
        doc_entry: DOC_ENTRIES.CLIENT_SECRET,
        doc_category: DOC_CATEGORY,
      },
      {
        label: LABELS.NAME,
        value: displayName,
        doc_entry: DOC_ENTRIES.DISPLAY_NAME,
        doc_category: DOC_CATEGORY,
      },
      {
        label: LABELS.DESCRIPTION,
        value: description,
        doc_entry: DOC_ENTRIES.DESCRIPTION,
        doc_category: DOC_CATEGORY,
      },
      {
        label: LABELS.SUBJECT_TYPE,
        value: displayOrDash(row.subjectType),
        doc_entry: DOC_ENTRIES.SUBJECT_TYPE,
        doc_category: DOC_CATEGORY,
      },
      {
        label: LABELS.APPLICATION_TYPE,
        value: displayOrDash(row.applicationType),
        doc_entry: DOC_ENTRIES.APPLICATION_TYPE,
        doc_category: DOC_CATEGORY,
      },
      {
        label: LABELS.IS_TRUSTED_CLIENT,
        value: row.trustedClient ? t('options.yes') : t('options.no'),
        doc_entry: DOC_ENTRIES.TRUSTED_CLIENT,
        doc_category: DOC_CATEGORY,
        isBadge: true,
        badgeBackgroundColor: row.trustedClient
          ? themeColors.badges.filledBadgeBg
          : themeColors.badges.disabledBg,
        badgeTextColor: row.trustedClient
          ? themeColors.badges.filledBadgeText
          : themeColors.badges.disabledText,
      },
      {
        label: LABELS.STATUS,
        value: isEnabled ? t('options.enabled') : t('options.disabled'),
        doc_entry: DOC_ENTRIES.DISABLED,
        doc_category: DOC_CATEGORY,
        isBadge: true,
        badgeBackgroundColor: isEnabled
          ? themeColors.badges.statusActiveBg
          : themeColors.badges.disabledBg,
        badgeTextColor: isEnabled
          ? themeColors.badges.statusActive
          : themeColors.badges.disabledText,
      },
      {
        label: LABELS.SCOPES,
        value: formatBadgeList(clientScopes),
        doc_entry: DOC_ENTRIES.SCOPES,
        doc_category: DOC_CATEGORY,
        isBadge: clientScopes.length > 0,
        badgeBackgroundColor: themeColors.badges.filledBadgeBg,
        badgeTextColor: themeColors.badges.filledBadgeText,
      },
      {
        label: LABELS.GRANT_TYPES,
        value: formatBadgeList(row.grantTypes?.map(getGrantTypeLabel)),
        doc_entry: DOC_ENTRIES.GRANT_TYPES,
        doc_category: DOC_CATEGORY,
        isBadge: (row.grantTypes?.length ?? 0) > 0,
        badgeBackgroundColor: themeColors.badges.filledBadgeBg,
        badgeTextColor: themeColors.badges.filledBadgeText,
      },
      {
        label: LABELS.LOGIN_URIS,
        value: formatBadgeList(row.redirectUris),
        doc_entry: DOC_ENTRIES.REDIRECT_URIS,
        doc_category: DOC_CATEGORY,
        isBadge: (row.redirectUris?.length ?? 0) > 0,
        badgeBackgroundColor: themeColors.badges.filledBadgeBg,
        badgeTextColor: themeColors.badges.filledBadgeText,
      },
      {
        label: LABELS.AUTHENTICATION_METHOD,
        value: displayOrDash(row.authenticationMethod),
        doc_entry: DOC_ENTRIES.TOKEN_ENDPOINT_AUTH_METHOD,
        doc_category: DOC_CATEGORY,
        isBadge: !!row.authenticationMethod,
        badgeBackgroundColor: themeColors.badges.filledBadgeBg,
        badgeTextColor: themeColors.badges.filledBadgeText,
      },
      {
        label: LABELS.RESPONSE_TYPES,
        value: formatBadgeList(row.responseTypes),
        doc_entry: DOC_ENTRIES.RESPONSE_TYPES,
        doc_category: DOC_CATEGORY,
      },
      {
        label: LABELS.LOGOUT_REDIRECT_URIS,
        value: formatBadgeList(row.postLogoutRedirectUris),
        doc_entry: DOC_ENTRIES.POST_LOGOUT_REDIRECT_URIS,
        doc_category: DOC_CATEGORY,
      },
    ],
    [row, displayName, description, isEnabled, clientScopes, t, themeColors],
  )

  return (
    <GluuDetailGrid
      fields={fields}
      labelStyle={labelStyle}
      defaultDocCategory={DOC_CATEGORY}
      layout="column"
    />
  )
}

export default memo(ClientDetailPage)
