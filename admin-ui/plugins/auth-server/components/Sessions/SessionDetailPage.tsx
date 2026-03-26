import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuBadge } from '@/components/GluuBadge'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useStyles } from './styles/SessionListPage.style'
import { formatDate } from '@/utils/dayjsUtils'
import type { SessionDetailPageProps } from './types'

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
  const { t } = useTranslation()

  const { state: themeState } = useTheme()
  const { themeColors, isDarkTheme } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDarkTheme: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const isAuth = row.state === 'authenticated'
  const stateBadge = isAuth ? badgeStyles.authenticatedBadge : badgeStyles.unauthenticatedBadge

  return (
    <div className={classes.expandedGrid}>
      <div className={classes.expandedField}>
        <GluuText variant="span" disableThemeColor className={classes.expandedLabel}>
          {t('fields.expiration')}:
        </GluuText>
        <GluuText variant="span" disableThemeColor className={classes.expandedValue}>
          {formatDate(row.expirationDate) || '—'}
        </GluuText>
      </div>

      <div className={classes.expandedField}>
        <GluuText variant="span" disableThemeColor className={classes.expandedLabel}>
          {t('fields.jans_id')}:
        </GluuText>
        <GluuText variant="span" disableThemeColor className={classes.expandedValue}>
          {extractJansId(row.userDn)}
        </GluuText>
      </div>

      <div className={classes.expandedField}>
        <GluuText variant="span" disableThemeColor className={classes.expandedLabel}>
          {t('fields.jans_state')}:
        </GluuText>
        <div>
          <GluuBadge
            size="sm"
            backgroundColor={stateBadge.backgroundColor}
            textColor={stateBadge.textColor}
            borderColor={stateBadge.borderColor}
            borderRadius={6}
          >
            {row.state ?? '—'}
          </GluuBadge>
        </div>
      </div>

      <div className={classes.expandedField}>
        <GluuText variant="span" disableThemeColor className={classes.expandedLabel}>
          {t('fields.permission_granted_map')}:
        </GluuText>
        <GluuText variant="span" disableThemeColor className={classes.expandedValue}>
          {safeStringify(row.permissionGrantedMap)}
        </GluuText>
      </div>

      <div className={classes.expandedHalfField}>
        <GluuText variant="span" disableThemeColor className={classes.expandedLabel}>
          {t('fields.jans_sess_state')}:
        </GluuText>
        <GluuText variant="span" disableThemeColor className={classes.expandedValue}>
          {row.sessionState ?? '—'}
        </GluuText>
      </div>

      <div className={classes.expandedHalfField}>
        <GluuText variant="span" disableThemeColor className={classes.expandedLabel}>
          {t('fields.jans_user_dn')}:
        </GluuText>
        <GluuText variant="span" disableThemeColor className={classes.expandedValue}>
          {row.userDn ?? '—'}
        </GluuText>
      </div>

      <div className={classes.expandedFullField}>
        <GluuText variant="span" disableThemeColor className={classes.expandedLabel}>
          {t('fields.jans_sess_attr')}:
        </GluuText>
        <GluuText variant="span" disableThemeColor className={classes.expandedValue}>
          {safeStringify(row.sessionAttributes)}
        </GluuText>
      </div>
    </div>
  )
}

export default SessionDetailPage
