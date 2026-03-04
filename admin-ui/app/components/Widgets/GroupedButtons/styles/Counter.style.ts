import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontSizes, fontWeights } from '@/styles/fonts'
import { OPACITY } from '@/constants'

export const useStyles = makeStyles()(() => {
  const border = `1px solid ${customColors.lightBlue}`

  return {
    stepButton: {
      'color': customColors.lightBlue,
      'border': border,
      'minWidth': 32,
      'fontSize': fontSizes.md,
      'fontWeight': fontWeights.semiBold,

      '&.MuiButtonGroup-groupedHorizontal:not(:last-of-type)': {
        borderRight: border,
      },
    },
    valueButton: {
      minWidth: 44,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      opacity: OPACITY.DISABLED,
    },
  }
})
