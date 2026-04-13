import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { RowProps } from 'Plugins/user-management/types/UserApiTypes'
import type { CustomAttrWithValues } from 'Plugins/user-management/types'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { useStyles } from './UserDetailViewPage.style'

const UserDetailViewPage = ({ row }: RowProps) => {
  const { rowData } = row
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ themeColors })

  const roleValue = useMemo(() => {
    const attrs = (rowData as { customAttributes?: CustomAttrWithValues[] })?.customAttributes
    if (!Array.isArray(attrs)) return ''
    const roleAttr = attrs.find((a) => a?.name === 'jansAdminUIRole') as
      | CustomAttrWithValues
      | undefined
    if (!roleAttr) return ''

    if (Array.isArray(roleAttr.values)) {
      const values = roleAttr.values.filter((v): v is string => typeof v === 'string')
      return values.join(', ')
    }

    return typeof roleAttr.value === 'string'
      ? roleAttr.value
      : typeof roleAttr.value === 'number' || typeof roleAttr.value === 'boolean'
        ? String(roleAttr.value)
        : ''
  }, [rowData])

  const lastName = useMemo(() => {
    const familyName = (rowData as { familyName?: string }).familyName
    const sn = (rowData as { sn?: string }).sn
    return familyName || sn || ''
  }, [rowData])

  const fields = useMemo(
    () => [
      { label: `${t('fields.name')}:`, value: rowData.displayName ?? '' },
      { label: `${t('fields.email')}:`, value: rowData.mail ?? '' },
      { label: `${t('fields.givenName')}:`, value: rowData.givenName ?? '' },
      { label: `${t('fields.userRole')}:`, value: roleValue },
      { label: `${t('fields.userName')}:`, value: rowData.userId ?? '' },
      { label: `${t('fields.lastName', { defaultValue: t('fields.sn') })}:`, value: lastName },
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
              <GluuText variant="div" className={classes.label}>
                {f.label}
              </GluuText>
              <GluuText variant="div" className={classes.value}>
                {f.value || '—'}
              </GluuText>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(UserDetailViewPage)
