import { useTranslation } from 'react-i18next'
import { FormGroup, Label } from 'Components'
import { Button, Grid } from '@mui/material'
import GluuTooltip from './GluuTooltip'
import { VisibilityOutlined } from '@mui/icons-material'

function GluuFormActionRow({
  label,
  value,
  lsize = 6,
  rsize = 2,
  doc_category,
  doc_entry,
  isDirect = false,
  onActionClick,
}: any) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={doc_entry || label}>
      <FormGroup row>
        <Grid container alignItems="center">
          <Grid item xs={lsize || 6}>
            <Label for={label} style={{ fontWeight: 'bold' }} sm={lsize || 6}>
              {t(label)}:
            </Label>
          </Grid>
          <Grid item xs={rsize || 2}>
            <Button
              variant="outlined"
              startIcon={<VisibilityOutlined />}
              onClick={() => {
                onActionClick(value)
              }}
            >
              {t('actions.view')}
            </Button>
          </Grid>
        </Grid>
      </FormGroup>
    </GluuTooltip>
  )
}

export default GluuFormActionRow
