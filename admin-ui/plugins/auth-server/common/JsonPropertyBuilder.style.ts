import { makeStyles } from 'tss-react/mui'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, MAPPING_SPACING, SPACING } from '@/constants'

const sharedInputStyles = {
  '& input, & select, & .custom-select, & .form-control': {
    minHeight: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
    height: 'auto',
    paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
    paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
    paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
    paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
    borderRadius: BORDER_RADIUS.SMALL,
  },
}

const formGroupOverrides = {
  '& .row.mb-3, & .mb-3': {
    marginBottom: '0 !important',
  },
  '& .row': {
    display: 'flex',
    flexDirection: 'column' as const,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  },
  '& .row > label, & .row > .col-form-label': {
    flex: '0 0 auto',
    width: '100%',
    maxWidth: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: CEDARLING_CONFIG_SPACING.LABEL_MB,
  },
  '& .row [class*="col"]': {
    flex: '0 0 100%',
    width: '100%',
    maxWidth: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
}

export const useStyles = makeStyles()(() => ({
  errorContainer: {
    marginTop: '-1.75rem',
    marginBottom: 0,
  },
  formGroupNoMargin: {
    marginBottom: 0,
    marginTop: 0,
  },
  errorCol: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  errorText: {
    marginTop: 0,
    marginBottom: 0,
    lineHeight: '1.2',
    paddingTop: `${MAPPING_SPACING.CHECKBOX_BORDER_WIDTH}px`,
    fontSize: '12px',
  },
  accordionHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.SECTION_GAP / 2,
    width: '100%',
  },
  removeButtonIcon: {
    fontSize: '16px',
  },
  nestedAccordionItem: {
    'marginBottom': SPACING.SECTION_GAP / 2,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  objectFieldsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: MAPPING_SPACING.INFO_ALERT_GAP,
    rowGap: SPACING.CARD_CONTENT_GAP,
    width: '100%',
    alignItems: 'start',
    paddingTop: 0,
  },
  objectFieldItem: {
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box' as const,
    ...formGroupOverrides,
    ...sharedInputStyles,
  },
  objectFieldItemFullWidth: {
    gridColumn: '1 / -1',
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box' as const,
    ...formGroupOverrides,
    ...sharedInputStyles,
  },
}))
