import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'
import { RowProps } from 'Plugins/user-management/types/UserApiTypes'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './UserDetailViewPage.style'

const UserDetailViewPage = ({ row }: RowProps) => {
  const { rowData } = row
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = getThemeColor(themeState.theme)
  const { classes } = useStyles({ isDark: themeState.theme === THEME_DARK, themeColors })

  const sanitizeValue = (value: string): string => {
    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  }

  const roleValue = useMemo(() => {
    const attrs = (rowData as unknown as { customAttributes?: Array<Record<string, unknown>> })
      ?.customAttributes
    if (!Array.isArray(attrs)) return ''
    const roleAttr = attrs.find((a) => a?.name === 'jansAdminUIRole')
    if (!roleAttr) return ''

    const asAny = roleAttr as {
      value?: unknown
      values?: unknown
      multiValued?: boolean
    }

    if (Array.isArray(asAny.values)) {
      const values = asAny.values.filter((v): v is string => typeof v === 'string')
      return values.join(', ')
    }

    return typeof asAny.value === 'string'
      ? asAny.value
      : typeof asAny.value === 'number' || typeof asAny.value === 'boolean'
        ? String(asAny.value)
        : ''
  }, [rowData])

  const lastName = useMemo(() => {
    const familyName = (rowData as { familyName?: string }).familyName
    const sn = (rowData as unknown as { sn?: string }).sn
    return familyName || sn || ''
  }, [rowData])

  const fields = useMemo(
    () =>
      [
        { label: `${t('fields.name')}:`, value: rowData.displayName ?? '' },
        { label: `${t('fields.email')}:`, value: rowData.mail ?? '' },
        { label: `${t('fields.givenName')}:`, value: rowData.givenName ?? '' },
        { label: 'jansAdminUIRole:', value: roleValue },
        { label: `${t('fields.userName')}:`, value: rowData.userId ?? '' },
        { label: `${t('fields.lastName', { defaultValue: 'Last Name' })}:`, value: lastName },
      ],
    [t, rowData.displayName, rowData.mail, rowData.givenName, roleValue, rowData.userId, lastName],
  )

  return (
    <div className={classes.panel}>
      <div className={classes.divider} aria-hidden="true" />
      <div className={classes.content}>
        <div className={classes.grid}>
        {fields.map((f) => (
          <div key={f.label} className={classes.field}>
            <div className={classes.label}>{sanitizeValue(f.label)}</div>
            <div className={classes.value}>{sanitizeValue(f.value) || '—'}</div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default UserDetailViewPage
