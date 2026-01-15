import { makeStyles } from 'tss-react/mui'
import { createTriggerStyles, chevronStyles } from '@/components/GluuDropdown/sharedDropdownStyles'

export const useStyles = makeStyles<{ isDark: boolean }>()((_, { isDark }) => ({
  trigger: createTriggerStyles({ isDark }),
  chevron: chevronStyles,
}))
