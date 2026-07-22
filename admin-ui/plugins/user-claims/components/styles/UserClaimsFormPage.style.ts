import { makeStyles } from 'tss-react/mui'
import {
  SPACING,
  BORDER_RADIUS,
  OPACITY,
  MOBILE_MEDIA_QUERY,
  createMobilePageTitleStyle,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createFormGroupOverrides } from '@/styles/formStyles'
import type { ThemeConfig } from '@/context/theme/config'

interface AttributeFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const INPUT_HEIGHT = 52
const INPUT_PADDING_VERTICAL = 14
const INPUT_PADDING_HORIZONTAL = 21
const SELECT_ARROW_SPACE = 44
const ERROR_SPACE = 20
export const useStyles = makeStyles<AttributeFormPageStylesParams>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground

  return {
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      position: 'relative' as const,
      overflow: 'visible' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      boxSizing: 'border-box' as const,
    },
    content: {
      padding: SPACING.CONTENT_PADDING,
      width: '100%',
      boxSizing: 'border-box' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        '& input, & select, & textarea, & .custom-select, & .form-control, & .react-toggle, & [role="combobox"]':
          {
            pointerEvents: 'none' as const,
          },
      },
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gridTemplateColumns: '1fr',
        rowGap: SPACING.SECTION_GAP,
      },
    },
    formGridFullSpan: {
      gridColumn: '1 / -1',
    },
    autocompleteField: {
      marginBottom: ERROR_SPACE,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginBottom: 0,
      },
    },
    outerLabel: {
      'display': 'flex',
      'alignItems': 'center',
      'gap': 6,
      'marginBottom': 4,
      'color': `${themeColors.fontColor} !important`,
      'fontFamily': `${fontFamily} !important`,
      'fontWeight': `${fontWeights.semiBold} !important`,
      'fontSize': `${fontSizes.base} !important`,
      'lineHeight': `${lineHeights.normal} !important`,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: themeColors.fontColor,
      },
    },
    outerLabelStar: {
      color: themeColors.fontColor,
    },
    fieldItem: {
      'width': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      ...createFormGroupOverrides(),
      '& .form-group > label': {
        ...createFormGroupOverrides()['& .form-group > label'],
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '2px !important',
      },
      '& .form-group [class*="col"]': {
        position: 'relative',
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
      '& .form-group [class*="col"]:has([data-field-error])': {
        paddingBottom: 20,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
      },
      '& .input-group': {
        margin: 0,
      },
      '& [role="combobox"][tabindex="-1"]': {
        backgroundColor: `${formInputBg} !important`,
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        '& .form-group [class*="col"]:has([data-field-error])': {
          paddingBottom: 0,
        },
      },
    },
    inumFullWidth: {
      'gridColumn': '1 / -1',
      '& .form-group [class*="col"]': {
        paddingBottom: 12,
        paddingLeft: 0,
        paddingRight: 0,
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        '& .form-group [class*="col"]': {
          paddingBottom: 0,
        },
      },
      '& input, & input:disabled': {
        backgroundColor: 'var(--theme-input-bg) !important',
        border: `1px solid ${inputBorderColor} !important`,
        color: 'var(--theme-input-color) !important',
        WebkitTextFillColor: 'var(--theme-input-color) !important',
      },
    },
    toggleRow: {
      'width': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      'paddingBottom': 18,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingBottom: 0,
      },
      ...createFormGroupOverrides(),
      '& .form-group > label': {
        ...createFormGroupOverrides()['& .form-group > label'],
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '2px !important',
      },
      '& .form-group [class*="col"]': {
        boxSizing: 'border-box' as const,
        paddingLeft: 0,
        paddingRight: 0,
      },
      '& .react-toggle--disabled': {
        opacity: `${OPACITY.DISABLED} !important`,
        cursor: 'not-allowed',
      },
    },
    formLabels: {
      '& label, & label h5, & label h5 span, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        fontStyle: 'normal !important',
        fontWeight: `${fontWeights.semiBold} !important`,
        lineHeight: `${lineHeights.normal} !important`,
        margin: '0 !important',
      },
    },
    formWithInputs: {
      '& input:not([type="checkbox"]), & select, & .custom-select, & textarea': {
        backgroundColor: 'var(--theme-input-bg) !important',
        border: `1px solid ${inputBorderColor} !important`,
        borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
        color: 'var(--theme-input-color) !important',
        WebkitTextFillColor: 'var(--theme-input-color) !important',
        caretColor: 'var(--theme-input-color)',
        minHeight: INPUT_HEIGHT,
        height: 'auto',
        paddingTop: INPUT_PADDING_VERTICAL,
        paddingBottom: INPUT_PADDING_VERTICAL,
        paddingLeft: INPUT_PADDING_HORIZONTAL,
        paddingRight: INPUT_PADDING_HORIZONTAL,
      },
      '& select, & .custom-select': {
        paddingRight: SELECT_ARROW_SPACE,
      },
      '& input:not([type="checkbox"]):focus, & input:not([type="checkbox"]):active, & select:focus, & select:active, & .custom-select:focus, & .custom-select:active, & textarea:focus, & textarea:active':
        {
          backgroundColor: 'var(--theme-input-bg) !important',
          color: 'var(--theme-input-color) !important',
          WebkitTextFillColor: 'var(--theme-input-color) !important',
          border: `1px solid ${inputBorderColor} !important`,
          outline: 'none',
          boxShadow: 'none',
        },
      '& input:not([type="checkbox"]):disabled, & select:disabled, & .custom-select:disabled, & textarea:disabled':
        {
          backgroundColor: `${formInputBg} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          color: `${themeColors.fontColor} !important`,
          WebkitTextFillColor: 'var(--theme-input-color) !important',
          opacity: `${OPACITY.FULL} !important`,
          cursor: 'not-allowed',
        },
      '& input:not([type="checkbox"]).is-valid, & input:not([type="checkbox"]).is-invalid, & select.is-valid, & select.is-invalid, & textarea.is-valid, & textarea.is-invalid':
        {
          border: `1px solid ${inputBorderColor} !important`,
          backgroundImage: 'none !important',
          boxShadow: 'none !important',
        },
      '& input.form-control, & input[type="text"], & input[type="number"], & textarea.form-control':
        {
          backgroundColor: 'var(--theme-input-bg) !important',
          color: 'var(--theme-input-color) !important',
          WebkitTextFillColor: 'var(--theme-input-color) !important',
          caretColor: 'var(--theme-input-color) !important',
        },
      '& input.form-control:focus, & input.form-control:active, & input.form-control:disabled': {
        color: 'var(--theme-input-color) !important',
        WebkitTextFillColor: 'var(--theme-input-color) !important',
        caretColor: 'var(--theme-input-color) !important',
      },
      '& input:not([type="checkbox"])::selection, & textarea::selection': {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
        color: 'var(--theme-input-color) !important',
      },
      '& input:not([type="checkbox"])::placeholder, & textarea::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: `${OPACITY.PLACEHOLDER} !important`,
      },
      '& input:not([type="checkbox"]):-webkit-autofill, & input:not([type="checkbox"]):-webkit-autofill:hover, & input:not([type="checkbox"]):-webkit-autofill:focus, & input:not([type="checkbox"]):-webkit-autofill:active':
        {
          WebkitBoxShadow: '0 0 0 100px var(--theme-input-bg) inset !important',
          WebkitTextFillColor: 'var(--theme-input-color) !important',
          backgroundColor: 'var(--theme-input-bg) !important',
          transition: 'background-color 5000s ease-in-out 0s',
        },
    },
  }
})
