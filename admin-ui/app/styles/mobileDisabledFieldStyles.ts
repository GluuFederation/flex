import { OPACITY, MOBILE_MEDIA_QUERY } from '@/constants'

const crispTextOnMobile = (fontColor: string) => ({
  [`@media ${MOBILE_MEDIA_QUERY}`]: {
    opacity: OPACITY.FULL,
    color: fontColor,
    WebkitTextFillColor: `${fontColor} !important`,
  },
})

export const createDisabledInputStyles = (fontColor: string) => ({
  cursor: 'not-allowed' as const,
  opacity: OPACITY.PLACEHOLDER,
  ...crispTextOnMobile(fontColor),
})

export const createDisabledSelectInputStyles = (fontColor: string) => ({
  'opacity': OPACITY.DISABLED,
  'cursor': 'not-allowed' as const,
  [`@media ${MOBILE_MEDIA_QUERY}`]: {
    'opacity': OPACITY.FULL,
    '& .MuiOutlinedInput-input': {
      color: `${fontColor} !important`,
      WebkitTextFillColor: `${fontColor} !important`,
    },
  },
})

export const createReadOnlySelectStyles = (fontColor: string) => ({
  color: `${fontColor} !important`,
  WebkitTextFillColor: `${fontColor} !important`,
  opacity: OPACITY.FULL,
  cursor: 'default' as const,
  pointerEvents: 'none' as const,
})
