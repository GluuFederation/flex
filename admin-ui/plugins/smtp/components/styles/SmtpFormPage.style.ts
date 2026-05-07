import { makeStyles } from 'tss-react/mui'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, OPACITY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

interface SmtpFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const LABEL_MARGIN_BOTTOM = 2
const LABEL_AREA_HEIGHT = 30
const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const INPUT_HEIGHT = 52
const INPUT_PADDING_VERTICAL = 14
const INPUT_PADDING_HORIZONTAL = 21
const ERROR_SPACE = 20
const FIELD_VERTICAL_PADDING = 4
const SECTION_BOX_TOP_PADDING = 12
const SECTION_HEADER_MB = 16
const SECTION_HEADER_GAP = 12

const formGroupOverrides = {
  '& .form-group': {
    display: 'flex',
    flexDirection: 'column' as const,
    margin: 0,
    padding: 0,
  },
  '& .form-group.row': {
    marginLeft: 0,
    marginRight: 0,
  },
  '& .form-group > label': {
    flex: '0 0 auto',
    width: '100%',
    maxWidth: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: LABEL_MARGIN_BOTTOM,
  },
  '& .form-group [class*="col"]': {
    flex: '0 0 100%',
    width: '100%',
    maxWidth: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  '& .input-group': {
    margin: 0,
  },
}

export const useStyles = makeStyles<SmtpFormPageStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const sectionBoxBg = formInputBg
  const sectionInputBg = cardBg
  const sectionBorderColor =
    themeColors.settings?.inputBorder ??
    themeColors.borderColor ??
    (isDark ? customColors.darkBorder : customColors.borderInput)

  return {
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    content: {
      padding: SPACING.CONTENT_PADDING,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      width: '100%',
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      alignItems: 'start',
      minWidth: 0,
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      'width': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box',
      ...formGroupOverrides,
      '& .form-group [class*="col"]': {
        ...formGroupOverrides['& .form-group [class*="col"]'],
        position: 'relative',
        paddingBottom: ERROR_SPACE,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
      },
    },
    fieldItemRelative: {
      position: 'relative',
    },
    fieldItemFullWidth: {
      width: '100%',
      gridColumn: '1 / -1',
      paddingTop: FIELD_VERTICAL_PADDING,
      paddingBottom: FIELD_VERTICAL_PADDING,
      boxSizing: 'border-box',
      ...formGroupOverrides,
    },
    togglesRow: {
      'gridColumn': '1 / -1',
      'display': 'flex',
      'gap': SPACING.SECTION_GAP,
      'alignItems': 'flex-start',
      'minWidth': 0,
      '& > div': {
        flex: '1 1 0',
        minWidth: 0,
      },
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
      },
    },
    formLabels: {
      '& label, & label h5, & label h5 span, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        fontStyle: 'normal',
        fontWeight: `${fontWeights.semiBold} !important`,
        lineHeight: `${lineHeights.normal} !important`,
        margin: '0 !important',
      },
      '& label': {
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: `${LABEL_MARGIN_BOTTOM}px !important`,
      },
    },
    formWithInputs: {
      '& input, & select, & .custom-select': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        borderRadius: BORDER_RADIUS.SMALL,
        color: `${themeColors.fontColor} !important`,
        minHeight: INPUT_HEIGHT,
        height: 'auto',
        paddingTop: INPUT_PADDING_VERTICAL,
        paddingBottom: INPUT_PADDING_VERTICAL,
        paddingLeft: INPUT_PADDING_HORIZONTAL,
        paddingRight: INPUT_PADDING_HORIZONTAL,
      },
      '& select, & .custom-select': {
        paddingRight: SELECT_ARROW_SPACE,
        marginTop: SELECT_NUDGE,
        marginBottom: SELECT_NUDGE,
      },
      '& input:focus, & input:active, & select:focus, & select:active, & .form-control:focus, & .input-group:focus-within':
        {
          borderColor: `${inputBorderColor} !important`,
          borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      '& input:disabled, & select:disabled': {
        backgroundColor: `${alpha(formInputBg, OPACITY.DISABLED)} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: OPACITY.PLACEHOLDER,
      },
      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
        WebkitBoxShadow: `0 0 0 100px ${formInputBg} inset !important`,
        WebkitTextFillColor: `${themeColors.fontColor} !important`,
        backgroundColor: `${formInputBg} !important`,
        transition: 'background-color 5000s ease-in-out 0s',
      },
    },
    sectionBox: {
      'backgroundColor': sectionBoxBg,
      'borderRadius': BORDER_RADIUS.SMALL,
      'border': `1px solid ${sectionBorderColor}`,
      'padding': `${SECTION_BOX_TOP_PADDING}px ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
      'width': '100%',
      'boxSizing': 'border-box',
      '& input, & input:focus, & input:active, & input:disabled': {
        backgroundColor: `${sectionInputBg} !important`,
        border: `1px solid ${sectionBorderColor} !important`,
      },
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SECTION_HEADER_MB,
      gap: SECTION_HEADER_GAP,
    },
    sectionTitle: {
      fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.description,
      fontStyle: 'normal',
      lineHeight: 1.4,
      color: themeColors.fontColor,
      margin: 0,
      padding: 0,
    },
    sectionGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      alignItems: 'start',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    testButtonRow: {
      gridColumn: '1 / -1',
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: SPACING.CARD_CONTENT_GAP,
      paddingBottom: SPACING.CARD_CONTENT_GAP,
    },
    formDivider: {
      height: 1,
      backgroundColor: isDark ? customColors.darkBorder : customColors.lightBorder,
      marginTop: SPACING.CARD_CONTENT_GAP,
      marginBottom: SPACING.CARD_CONTENT_GAP,
      border: 'none',
    },
    keystoreOverlay: {
      position: 'absolute',
      top: LABEL_AREA_HEIGHT,
      left: 0,
      right: 0,
      bottom: ERROR_SPACE,
      zIndex: 1,
      cursor: 'not-allowed',
    },
  }
})
