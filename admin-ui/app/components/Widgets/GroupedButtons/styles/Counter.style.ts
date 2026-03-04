import { makeStyles } from 'tss-react/mui'
import { fontSizes, fontWeights } from '@/styles/fonts'
import { OPACITY } from '@/constants'

interface CounterStyleParams {
  fontColor: string
}

export const useStyles = makeStyles<CounterStyleParams>()((_theme, { fontColor }) => {
  const border = `1px solid ${fontColor}`

  return {
    stepButton: {
      'color': fontColor,
      'border': border,
      'minWidth': 32,
      'fontSize': fontSizes.md,
      'fontWeight': fontWeights.semiBold,

      '&.MuiButtonGroup-groupedHorizontal:not(:last-of-type)': {
        borderRight: border,
      },

      '&.Mui-disabled': {
        color: fontColor,
        border,
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
        pointerEvents: 'auto',
      },
    },
    valueButton: {
      minWidth: 44,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      color: `${fontColor} !important`,
    },
  }
})
