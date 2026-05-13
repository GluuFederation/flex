import type { Theme } from '@mui/material/styles'
import { SPACING } from '@/constants'
import { createFormGroupOverrides } from '@/styles/formStyles'

type FormGroupBase = ReturnType<typeof createFormGroupOverrides>

export const createClientFormLayoutStyles = (theme: Theme, formGroupBase: FormGroupBase) => ({
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.SECTION_GAP,
    width: '100%',
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: SPACING.SECTION_GAP,
    rowGap: SPACING.CARD_CONTENT_GAP,
    width: '100%',
    alignItems: 'start',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  fieldItem: {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box' as const,
    ...formGroupBase,
  },
  fieldItemFullWidth: {
    width: '100%',
    minWidth: 0,
    gridColumn: '1 / -1',
    boxSizing: 'border-box' as const,
    ...formGroupBase,
  },
})
