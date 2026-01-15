import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import {
  createChevronStyles,
  createChevronOpenStyles,
  NO_TEXT_SELECT,
} from '@/components/GluuDropdown/sharedDropdownStyles'

export const useStyles = makeStyles<{ isDark: boolean }>()((theme, { isDark }) => ({
  trigger: {
    'border': `1px solid ${isDark ? customColors.white : customColors.primaryDark}`,
    'borderRadius': '4px',
    'height': '44px',
    'padding': '0px 13px',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'minWidth': '95px',
    'cursor': 'pointer',
    'backgroundColor': 'transparent',
    'fontFamily': fontFamily,
    'fontSize': fontSizes.base,
    'fontWeight': fontWeights.medium,
    'lineHeight': lineHeights.relaxed,
    'color': isDark ? customColors.white : customColors.textSecondary,
    ...NO_TEXT_SELECT,
    '&:hover': {
      opacity: 0.8,
    },
  },
  chevron: createChevronStyles(),
  chevronOpen: createChevronOpenStyles(),
  optionLabel: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
  },
}))
