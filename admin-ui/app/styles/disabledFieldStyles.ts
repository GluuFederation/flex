import { OPACITY } from '@/constants'

export const createDisabledInputStyles = (fontColor: string) => ({
  cursor: 'not-allowed' as const,
  opacity: OPACITY.FULL,
  color: fontColor,
  WebkitTextFillColor: `${fontColor} !important`,
})

export const createDisabledSelectInputStyles = (fontColor: string) => ({
  'cursor': 'not-allowed' as const,
  'opacity': OPACITY.FULL,
  '& .MuiOutlinedInput-input': {
    color: `${fontColor} !important`,
    WebkitTextFillColor: `${fontColor} !important`,
  },
})

export const createReadOnlySelectStyles = (fontColor: string) => ({
  color: `${fontColor} !important`,
  WebkitTextFillColor: `${fontColor} !important`,
  opacity: OPACITY.FULL,
  cursor: 'default' as const,
  pointerEvents: 'none' as const,
})
