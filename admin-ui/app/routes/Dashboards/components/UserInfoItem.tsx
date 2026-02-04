import { memo } from 'react'
import { GluuBadge } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import customColors from '@/customColors'

type ClassesType = Record<string, string>

interface UserInfoItemProps {
  item: { text: string; value: string | undefined }
  classes: ClassesType
  isStatus?: boolean
  isDark?: boolean
  t: (key: string) => string
}

export const UserInfoItem = memo<UserInfoItemProps>(({ item, classes, isStatus, isDark, t }) => {
  if (isStatus) {
    const isActive = item.value === 'active'
    const displayValue = item.value
      ? isActive
        ? t('dashboard.active')
        : t('dashboard.inactive')
      : '-'

    const badgeColors = isActive
      ? {
          bg: isDark ? customColors.statusActive : customColors.statusActiveBg,
          text: isDark ? customColors.white : customColors.statusActive,
        }
      : {
          bg: isDark ? customColors.statusInactive : customColors.statusInactiveBg,
          text: isDark ? customColors.white : customColors.statusInactive,
        }

    return (
      <div className={classes.userInfoItem}>
        <GluuText variant="div" className={classes.userInfoText}>
          {item.text}:
        </GluuText>
        <div className={classes.userInfoValue}>
          <GluuBadge
            size="sm"
            backgroundColor={badgeColors.bg}
            textColor={badgeColors.text}
            borderColor={badgeColors.bg}
          >
            {displayValue}
          </GluuBadge>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.userInfoItem}>
      <GluuText variant="div" className={classes.userInfoText}>
        {item.text}:
      </GluuText>
      <GluuText variant="div" className={classes.userInfoValue}>
        {item.value || '-'}
      </GluuText>
    </div>
  )
})

UserInfoItem.displayName = 'UserInfoItem'
