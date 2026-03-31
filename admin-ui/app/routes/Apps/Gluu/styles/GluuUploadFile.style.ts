import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { OPACITY } from '@/constants'
import customColors from '@/customColors'

export const useStyles = makeStyles<{ fontColor: string; removeDisabled: boolean }>()(
  (theme: Theme, { fontColor, removeDisabled }) => ({
    root: {
      width: '100%',
    },
    dropzoneWithFile: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'left',
      width: '100%',
      boxSizing: 'border-box',
    },
    fileRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
      flex: '1 1 100%',
      gap: theme.spacing(1),
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'baseline',
      gap: theme.spacing(0.5),
      minWidth: 0,
      overflow: 'hidden',
    },
    fileName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 700,
      color: fontColor,
      maxWidth: 300,
    },
    fileSize: {
      flexShrink: 0,
      margin: 0,
      whiteSpace: 'nowrap',
      color: alpha(fontColor, OPACITY.PLACEHOLDER),
    },
    removeWrap: {
      flexShrink: 0,
    },
    removeButton: {
      'backgroundColor': removeDisabled ? customColors.darkGray : customColors.accentRed,
      'color': customColors.white,
      'border': 'none',
      'cursor': removeDisabled ? 'not-allowed' : 'pointer',
      'opacity': removeDisabled ? OPACITY.PLACEHOLDER : OPACITY.FULL,
      'padding': `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
      'minHeight': 36,
      '&:hover': {
        backgroundColor: removeDisabled
          ? customColors.darkGray
          : alpha(customColors.accentRed, 0.85),
      },
    },
    placeholder: {
      margin: 0,
      width: '100%',
      textAlign: 'center',
    },
  }),
)
