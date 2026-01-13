import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'

export const useStyles = makeStyles<{ isDark: boolean }>()((theme, { isDark }) => ({
  trigger: {
    'border': `1px solid ${isDark ? customColors.white : customColors.primaryDark}`,
    'borderRadius': '4px',
    'height': '44px',
    'padding': '0px 14px',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'minWidth': '67px',
    'cursor': 'pointer',
    'backgroundColor': 'transparent',
    'fontFamily': fontFamily,
    'fontSize': fontSizes.base,
    'fontWeight': fontWeights.medium,
    'lineHeight': lineHeights.relaxed,
    'color': isDark ? customColors.white : customColors.textSecondary,
    '&:hover': {
      opacity: 0.8,
    },
  },
  chevron: {
    width: '18px',
    height: '18px',
    marginLeft: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'inherit',
    transition: 'transform 0.2s ease',
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
}))
