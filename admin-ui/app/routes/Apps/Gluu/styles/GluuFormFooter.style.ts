import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

interface FormFooterStyleParams {
  hasRightGroup: boolean
}

export const useStyles = makeStyles<FormFooterStyleParams>()((_theme, { hasRightGroup }) => ({
  footerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: hasRightGroup ? 'space-between' : 'flex-start',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },

  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
}))

export const BUTTON_STYLES = {
  height: 40,
  paddingX: 28,
  paddingY: 10,
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '0.28px',
}

export const getButtonColors = (isDark: boolean) => ({
  back: {
    backgroundColor: customColors.statusActive,
    textColor: customColors.white,
    borderColor: customColors.statusActive,
  },
  apply: {
    backgroundColor: isDark ? customColors.white : customColors.primaryDark,
    textColor: isDark ? customColors.primaryDark : customColors.white,
    borderColor: isDark ? customColors.white : customColors.primaryDark,
  },
  cancel: {
    backgroundColor: 'transparent',
    textColor: isDark ? customColors.white : customColors.primaryDark,
    borderColor: isDark ? customColors.white : customColors.primaryDark,
    outlined: true,
  },
})
