import React, { useMemo } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuDetailGrid } from '@/components/GluuDetailGrid'
import type { GluuDetailGridField } from '@/components/GluuDetailGrid'
import { useStyles } from './styles/SessionListPage.style'
import { formatDate } from '@/utils/dayjsUtils'
import { AUTHENTICATED_SESSION_STATE, DOC_CATEGORY, type SessionDetailPageProps } from '../types'

const JANS_ID_ATTRS = ['inum', 'jansid', 'jansuniqueid']

const extractJansId = (userDn: string | undefined): string => {
  if (!userDn) return '—'
  try {
    const parts = userDn.split(',')
    for (const part of parts) {
      const equalIndex = part.indexOf('=')
      if (equalIndex === -1) continue
      const attr = part.substring(0, equalIndex).trim().toLowerCase()
      if (JANS_ID_ATTRS.includes(attr)) {
        return part.substring(equalIndex + 1).trim()
      }
    }
    return '—'
  } catch {
    return '—'
  }
}

const safeStringify = (
  obj: Record<string, string | boolean | undefined> | null | undefined,
): string => {
  if (!obj) return '—'
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return '—'
  }
}

const SessionDetailPage: React.FC<SessionDetailPageProps> = ({ row }) => {
  const { state: themeState } = useTheme()
  const { themeColors, isDarkTheme } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDarkTheme: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const stateBadge = useMemo(
    () =>
      row.state === AUTHENTICATED_SESSION_STATE
        ? badgeStyles.authenticatedBadge
        : badgeStyles.unauthenticatedBadge,
    [row.state, badgeStyles.authenticatedBadge, badgeStyles.unauthenticatedBadge],
  )
  const expirationText = useMemo(() => formatDate(row.expirationDate) || '—', [row.expirationDate])
  const jansId = useMemo(() => extractJansId(row.userDn), [row.userDn])
  const permissionGrantedMapText = useMemo(
    () => safeStringify(row.permissionGrantedMap),
    [row.permissionGrantedMap],
  )
  const sessionAttributesText = useMemo(
    () => safeStringify(row.sessionAttributes),
    [row.sessionAttributes],
  )

  const detailLabelStyle = useMemo(
    () => ({ color: themeColors.fontColor }),
    [themeColors.fontColor],
  )

  const fields: GluuDetailGridField[] = useMemo(
    () => [
      { label: 'fields.expiration', value: expirationText, doc_entry: 'expirationDate' },
      { label: 'fields.jans_id', value: jansId, doc_entry: 'jansId' },
      {
        label: 'fields.jans_state',
        value: row.state ?? '—',
        doc_entry: 'jansState',
        isBadge: true,
        badgeBackgroundColor: stateBadge.backgroundColor,
        badgeTextColor: stateBadge.textColor,
      },
      {
        label: 'fields.permission_granted_map',
        value: permissionGrantedMapText,
        doc_entry: 'permissionGrantedMap',
      },
      {
        label: 'fields.jans_sess_state',
        value: row.sessionState ?? '—',
        doc_entry: 'jansSessState',
        fullWidth: true,
      },
      {
        label: 'fields.jans_user_dn',
        value: row.userDn ?? '—',
        doc_entry: 'jansUsrDN',
        fullWidth: true,
      },
      {
        label: 'fields.jans_sess_attr',
        value: sessionAttributesText,
        doc_entry: 'jansSessAttr',
        fullWidth: true,
      },
    ],
    [
      expirationText,
      jansId,
      row.state,
      row.sessionState,
      row.userDn,
      stateBadge,
      permissionGrantedMapText,
      sessionAttributesText,
    ],
  )

  return (
    <GluuDetailGrid
      fields={fields}
      labelStyle={detailLabelStyle}
      defaultDocCategory={DOC_CATEGORY}
      layout="column"
    />
  )
}

export default SessionDetailPage
