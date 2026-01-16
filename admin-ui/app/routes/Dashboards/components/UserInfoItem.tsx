import { memo, useContext } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import { ThemeContext } from 'Context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'

type ClassesType = Record<string, string>

interface UserInfoItemProps {
  item: { text: string; value: string | undefined }
  classes: ClassesType
  isStatus?: boolean
  t: (key: string) => string
}

export const UserInfoItem = memo<UserInfoItemProps>(({ item, classes, isStatus, t }) => {
  const themeContext = useContext(ThemeContext)
  const isDark = (themeContext?.state.theme || DEFAULT_THEME) === THEME_DARK

  if (isStatus) {
    const isActive = item.value === 'active'

    if (!item.value) {
      return (
        <div className={classes.userInfoItem}>
          <div className={classes.userInfoText}>{item.text}:</div>
          <div className={classes.userInfoValue}>-</div>
        </div>
      )
    }

    return (
      <div className={classes.userInfoItem}>
        <div className={classes.userInfoText}>{item.text}:</div>
        <StatusBadge
          text={isActive ? t('dashboard.active') : t('dashboard.inactive')}
          isActive={isActive}
          isDark={isDark}
        />
      </div>
    )
  }

  return (
    <div className={classes.userInfoItem}>
      <div className={classes.userInfoText}>{item.text}:</div>
      <div className={classes.userInfoValue}>{item.value || '-'}</div>
    </div>
  )
})

UserInfoItem.displayName = 'UserInfoItem'
