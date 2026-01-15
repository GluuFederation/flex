import { makeStyles } from 'tss-react/mui'
import {
  createTriggerStyles,
  createChevronStyles,
  createChevronOpenStyles,
} from '@/components/GluuDropdown/sharedDropdownStyles'

export const useStyles = makeStyles<{ isDark: boolean }>()((_, { isDark }) => ({
  trigger: createTriggerStyles({ isDark }),
  chevron: createChevronStyles(),
  chevronOpen: createChevronOpenStyles(),
}))
