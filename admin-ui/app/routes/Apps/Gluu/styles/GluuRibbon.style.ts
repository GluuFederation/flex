import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'

const ribbonShadow = `4px 4px 15px rgba(${hexToRgb(customColors.ribbonShadowColor)}, 0.2)`

const sharedRibbon = {
  position: 'absolute' as const,
  top: '11px',
  padding: '8px',
  minWidth: '12rem',
  background: customColors.logo,
  zIndex: 3,
  color: customColors.white,
  textAlign: 'center' as const,
  boxShadow: ribbonShadow,
}

export const useStyles = makeStyles()(() => ({
  ribbonRight: {
    ...sharedRibbon,
    right: '-5px',
    fontWeight: 'bold',
    borderRadius: '50px 0px 0px 50px',
  },
  ribbonLeft: {
    ...sharedRibbon,
    left: '-5px',
    borderRadius: '0px 50px 50px 0px',
  },
}))
