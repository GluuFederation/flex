import { makeStyles } from 'tss-react/mui'
import {
  createTriggerStyles,
  createChevronStyles,
  createChevronOpenStyles,
} from '@/components/GluuDropdown/sharedDropdownStyles'
import { NAVBAR_TABLET, SIDEBAR_TOGGLE_BAND_MEDIA_QUERY } from '@/constants'

export const useStyles = makeStyles<{ isDark: boolean }>()((_, { isDark }) => ({
  trigger: {
    ...createTriggerStyles({ isDark }),
    [`@media ${SIDEBAR_TOGGLE_BAND_MEDIA_QUERY}`]: {
      height: `${NAVBAR_TABLET.CONTROL_SIZE}px`,
      padding: '0px 10px',
    },
  },
  chevron: createChevronStyles(),
  chevronOpen: createChevronOpenStyles(),
}))
