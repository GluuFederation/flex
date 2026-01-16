import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing } from '@/styles/fonts'
import type { StatusBadgeTheme } from './StatusBadge'

const useStyles = makeStyles<{ theme: StatusBadgeTheme; isDark: boolean }>()((
  _,
  { theme, isDark },
) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'active':
      case 'success':
        return {
          background: isDark ? customColors.statusActive : customColors.statusActiveBg,
          color: isDark ? customColors.white : customColors.statusActive,
        }
      case 'inactive':
      case 'danger':
        return {
          background: isDark ? customColors.statusInactive : customColors.statusInactiveBg,
          color: isDark ? customColors.white : customColors.statusInactive,
        }
      case 'warning':
        // Using existing customColors only - warning theme not in Figma, using orange
        // Note: Using whiteSmoke as background since warning background color is not in Figma
        return {
          background: isDark ? customColors.orange : customColors.whiteSmoke,
          color: isDark ? customColors.white : customColors.orange,
        }
      case 'info':
        // Using existing customColors only - info theme not in Figma, using lightBlue
        // Note: Using whiteSmoke as background since info background color is not in Figma
        return {
          background: isDark ? customColors.lightBlue : customColors.whiteSmoke,
          color: isDark ? customColors.white : customColors.lightBlue,
        }
      default:
        return {
          background: isDark ? customColors.statusActive : customColors.statusActiveBg,
          color: isDark ? customColors.white : customColors.statusActive,
        }
    }
  }

  const colors = getThemeColors()

  return {
    badge: {
      backgroundColor: `${colors.background} !important`,
      color: `${colors.color} !important`,
      borderRadius: 5,
      padding: '2px 8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.tight,
      whiteSpace: 'nowrap',
      lineHeight: 0,
      height: 'fit-content',
      width: 'fit-content',
    },
    badgeText: {
      color: `${colors.color} !important`,
      lineHeight: '24px',
      margin: 0,
      padding: 0,
    },
  }
})

export { useStyles }
