import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()(() => ({
  licenseCard: {
    minWidth: '275px',
    width: '100%',
    border: `1px solid ${customColors.statusActive}`,
    padding: '8px',
  },
  licenseCardActions: {
    padding: '0 16px 16px 16px',
  },
  licenseGenerateBtn: {
    color: `${customColors.statusActive} !important`,
    border: `2px solid ${customColors.statusActive} !important`,
  },
  licenseSubmitBtn: {
    backgroundColor: `${customColors.statusActive} !important`,
    color: `${customColors.white} !important`,
  },
}))
