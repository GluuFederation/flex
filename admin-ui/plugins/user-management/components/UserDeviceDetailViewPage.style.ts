import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'
import { fontWeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

type UserDeviceDetailStylesParams = {
  themeColors: ThemeConfig
}

const SECTION_HEADING_BORDER = '2px solid'

const useStyles = makeStyles<UserDeviceDetailStylesParams>()((_, { themeColors }) => ({
  container: {
    backgroundColor: themeColors.lightBackground,
    padding: SPACING.CARD_PADDING,
    width: '100%',
  },
  sectionHeading: {
    borderBottom: SECTION_HEADING_BORDER,
    fontWeight: fontWeights.bold,
  },
}))

export { useStyles }
