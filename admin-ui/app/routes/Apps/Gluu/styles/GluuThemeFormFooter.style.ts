import { makeStyles } from 'tss-react/mui'
import getThemeColor from '@/context/theme/config'

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

export const getButtonColors = (theme: string) => {
  return getThemeColor(theme).formFooter
}
