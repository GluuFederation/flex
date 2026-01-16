import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'

interface StylesParams {
  isDark: boolean
}

export const useStyles = makeStyles<StylesParams>()((_theme, { isDark }) => ({
  pageContainer: {
    width: '100%',
    padding: '0 30px',
    boxSizing: 'border-box',
  },
  licenseCard: {
    backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
    borderRadius: '16px',
    border: 'none',
    padding: '32px',
    // boxShadow: isDark ? 'none' : `0px 4px 11px 0px ${customColors.shadowLight}`,
    width: '100%',
    boxSizing: 'border-box',
  },
  licenseContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px 24px',
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.wide,
    color: isDark ? customColors.textMutedDark : customColors.textSecondary,
    margin: 0,
    padding: 0,
  },
  value: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
    color: isDark ? customColors.white : customColors.primaryDark,
    margin: 0,
    padding: 0,
  },
  buttonContainer: {
    'marginTop': '32px',
    'display': 'flex',
    'justifyContent': 'flex-start',
    '@media (max-width: 768px)': {
      marginTop: '24px',
    },
  },
  removeButton: {
    'backgroundColor': customColors.statusInactive,
    'color': customColors.white,
    'border': 'none',
    'borderRadius': '6px',
    'padding': '10px 28px',
    'height': '40px',
    fontFamily,
    'fontSize': fontSizes.base,
    'fontWeight': fontWeights.bold,
    'letterSpacing': letterSpacing.wide,
    'lineHeight': lineHeights.relaxed,
    'cursor': 'pointer',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'transition': 'opacity 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    },
  },
  card: {
    backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
    borderRadius: '16px',
    border: isDark ? `1.5px solid ${customColors.darkBorderAccent}` : 'none',
    boxShadow: isDark ? 'none' : `0px 4px 11px 0px ${customColors.shadowLight}`,
    padding: 0,
  },
  cardBody: {
    padding: '15px',
  },
}))
