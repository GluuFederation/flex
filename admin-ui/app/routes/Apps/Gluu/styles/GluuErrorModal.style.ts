import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { MOBILE_MEDIA_QUERY, SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'

const LOGO_WIDTH = 260
const LOGO_WIDTH_MOBILE = 180

const DESCRIPTION_MAX_WIDTH = 640

const LOGO_GAP = SPACING.PAGE * 2
const LOGO_GAP_MOBILE = SPACING.SECTION_GAP + SPACING.CARD_CONTENT_GAP
const HEADING_GAP = SPACING.PAGE
const HEADING_GAP_MOBILE = SPACING.CARD_BUTTON_GAP
const ACTION_GAP = SPACING.PAGE * 2
const ACTION_GAP_MOBILE = SPACING.SECTION_GAP + SPACING.CARD_CONTENT_GAP

const useStyles = makeStyles()(() => ({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: customColors.black,
    color: customColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontFamily,
    padding: SPACING.PAGE,
    textAlign: 'center',
  },
  logo: {
    width: LOGO_WIDTH,
    height: 'auto',
    marginBottom: LOGO_GAP,
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      width: LOGO_WIDTH_MOBILE,
      marginBottom: LOGO_GAP_MOBILE,
    },
  },
  message: {
    color: customColors.white,
    fontSize: fontSizes.pageTitle,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.XLose,
    margin: 0,
    marginBottom: HEADING_GAP,
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.loose,
      marginBottom: HEADING_GAP_MOBILE,
    },
  },
  description: {
    fontSize: fontSizes.description,
    lineHeight: lineHeights.base,
    margin: 0,
    marginBottom: ACTION_GAP,
    maxWidth: DESCRIPTION_MAX_WIDTH,
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      marginBottom: ACTION_GAP_MOBILE,
    },
  },
  retryButton: {
    border: 0,
    backgroundColor: 'transparent',
    color: customColors.white,
    cursor: 'pointer',
    fontFamily,
    fontSize: fontSizes.md,
    padding: 0,
    textDecoration: 'underline',
  },
}))

export { useStyles }
