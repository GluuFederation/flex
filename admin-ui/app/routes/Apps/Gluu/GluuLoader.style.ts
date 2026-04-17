import { makeStyles } from 'tss-react/mui'
import customColors, { getLoadingOverlayRgba } from '@/customColors'
import { OPACITY } from '@/constants'

const OVERLAY_BG_LIGHT = getLoadingOverlayRgba(customColors.black, OPACITY.OVERLAY)
const OVERLAY_BG_DARK = getLoadingOverlayRgba(customColors.darkCardBg, OPACITY.OVERLAY)

interface GluuLoaderStyleParams {
  isDark: boolean
}

export const useStyles = makeStyles<GluuLoaderStyleParams>()((_, { isDark }) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? OVERLAY_BG_DARK : OVERLAY_BG_LIGHT,
  },
}))
