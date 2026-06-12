import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { MODAL, SPACING } from '@/constants/ui'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import { BUTTON_STYLES } from './GluuThemeFormFooter.style'

const SESSION_DIALOG_WIDTH = 580

const styles = makeStyles<{ themeColors: ThemeConfig; isDark: boolean }>()(
  (theme, { themeColors }) => ({
    modalContainer: {
      width: `min(${SESSION_DIALOG_WIDTH}px, ${MODAL.MAX_VW})`,
      maxWidth: `${SESSION_DIALOG_WIDTH}px`,
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
    contentText: {
      fontFamily,
      fontSize: fontSizes.content,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.base,
      letterSpacing: letterSpacing.content,
      color: themeColors.textMuted,
    },
    buttonRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: theme.spacing(2),
      marginTop: SPACING.SECTION_GAP,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      letterSpacing: BUTTON_STYLES.letterSpacing,
    },
  }),
)

export default styles
