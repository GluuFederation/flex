import { memo } from 'react'

type ClassesType = Record<string, string>

interface UserInfoItemProps {
  item: { text: string; value: string | undefined }
  classes: ClassesType
  isStatus?: boolean
  t: (key: string) => string
}

export const UserInfoItem = memo<UserInfoItemProps>(({ item, classes, isStatus, t }) => {
  if (isStatus) {
    const isActive = item.value === 'active'
    const displayValue = item.value
      ? isActive
        ? t('dashboard.active')
        : t('dashboard.inactive')
      : '-'
    return (
      <div className={classes.userInfoItem}>
        <div className={classes.userInfoText}>{item.text}:</div>
        <span className={isActive ? classes.greenBlock : classes.redBlock}>{displayValue}</span>
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
