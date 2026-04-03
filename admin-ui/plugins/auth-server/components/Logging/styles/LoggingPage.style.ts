import { makeStyles } from 'tss-react/mui'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { ThemeConfig } from '@/context/theme/config'
import { SPACING, BORDER_RADIUS, OPACITY, CEDARLING_CONFIG_SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createFormGroupOverrides, createFormLabelStyles } from '@/styles/formStyles'

type StyleProps = {
  isDark: boolean
  themeColors: ThemeConfig
}

const INPUT_HEIGHT = CEDARLING_CONFIG_SPACING.INPUT_HEIGHT
const INPUT_PADDING_VERTICAL = CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL
const INPUT_PADDING_HORIZONTAL = CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL
const SELECT_ARROW_SPACE = 44

export const useStyles = makeStyles<StyleProps>()((theme: Theme, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const fontColor = themeColors.fontColor
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  return {
    pageCard: {
      backgroundColor: cardBg,
      borderRadius: BORDER_RADIUS.DEFAULT,
      ...cardBorderStyle,
      padding: SPACING.CARD_PADDING,
    },
    formContent: {
      ...createFormGroupOverrides({ columnPaddingBottom: 20 }),
      ...createFormLabelStyles(fontColor),
      '& select, & .custom-select, & .form-control': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        borderRadius: BORDER_RADIUS.SMALL,
        color: `${fontColor} !important`,
        caretColor: fontColor,
        minHeight: INPUT_HEIGHT,
        height: 'auto',
        paddingTop: INPUT_PADDING_VERTICAL,
        paddingBottom: INPUT_PADDING_VERTICAL,
        paddingLeft: INPUT_PADDING_HORIZONTAL,
        paddingRight: SELECT_ARROW_SPACE,
      },
      '& select:focus, & select:active, & .custom-select:focus, & .form-control:focus': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        outline: 'none',
        boxShadow: 'none',
      },
      '& select:disabled, & .custom-select:disabled, & .form-control:disabled': {
        backgroundColor: `${alpha(formInputBg, OPACITY.DISABLED)} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${fontColor} !important`,
        cursor: 'not-allowed',
      },
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      minWidth: 0,
      width: '100%',
    },
    fieldItemFullWidth: {
      gridColumn: '1 / -1',
      minWidth: 0,
      width: '100%',
    },
  }
})
