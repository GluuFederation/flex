import { makeStyles } from 'tss-react/mui'
import getThemeColor, { type FormFooterColors } from '@/context/theme/config'
import { OPACITY } from '@/constants'

interface FormFooterStyleParams {
  hasRightGroup: boolean
}

export const STEP_NAV_SIZES = {
  buttonSize: 40,
  iconSize: 22,
  labelFontSize: 15,
} as const

export const BUTTON_STYLES = {
  height: 40,
  paddingX: 28,
  paddingY: 10,
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '0.28px',
}

export const useStyles = makeStyles<FormFooterStyleParams>()((_theme, { hasRightGroup }) => ({
  footerWrapper: {
    position: 'relative',
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

  centerGroup: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },

  stepNavButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: STEP_NAV_SIZES.buttonSize,
    minHeight: STEP_NAV_SIZES.buttonSize,
    padding: 0,
    background: 'none',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
  },

  stepNavButtonDisabled: {
    opacity: OPACITY.DISABLED,
    cursor: 'not-allowed',
  },

  stepNavLabel: {
    fontSize: STEP_NAV_SIZES.labelFontSize,
    fontWeight: 500,
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    minWidth: 60,
    textAlign: 'center' as const,
  },
}))

export const getButtonColors = (theme: string): FormFooterColors => {
  const colors = getThemeColor(theme)
  return colors.formFooter
}
