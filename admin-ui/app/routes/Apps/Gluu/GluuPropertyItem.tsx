import { FormGroup, Col, Input, Button } from 'Components'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import customColors from '@/customColors'

function GluuPropertyItem({
  property,
  position,
  keyPlaceholder,
  valuePlaceholder,
  onPropertyChange,
  onPropertyRemove,
  disabled = false,
  isInputLabels = false,
  keyLabel = '',
  valueLabel = '',
  isRemoveButton,
  isKeys,
  sm = 6,
  multiProperties = false,
  destinationPlaceholder = '',
  sourcePlaceholder = '',
}: any) {
  const { t } = useTranslation()
  return (
    <FormGroup row>
      {isKeys && (
        <Col sm={4}>
          {isInputLabels && <label>{keyLabel}</label>}
          <Input
            name={'key'}
            value={property.key}
            disabled={disabled}
            onChange={(event) => onPropertyChange(position, event)}
            placeholder={keyPlaceholder ? t(keyPlaceholder) : t('placeholders.enter_property_key')}
          />
        </Col>
      )}
      <Col sm={sm}>
        {isInputLabels && <label>{valueLabel}</label>}
        {!multiProperties ? (
          <Input
            name={'value'}
            value={property.value}
            disabled={disabled}
            onChange={(event) => onPropertyChange(position, event)}
            placeholder={
              valuePlaceholder ? t(valuePlaceholder) : t('placeholders.enter_property_value')
            }
          />
        ) : (
          <Box display="flex" gap={2} alignItems={'center'}>
            <Input
              name={'source'}
              value={property.source}
              disabled={disabled}
              onChange={(event) => onPropertyChange(position, event)}
              placeholder={
                sourcePlaceholder ? t(sourcePlaceholder) : t('placeholders.enter_source_value')
              }
            />
            <Input
              name={'destination'}
              value={property.destination}
              disabled={disabled}
              onChange={(event) => onPropertyChange(position, event)}
              placeholder={
                destinationPlaceholder
                  ? t(destinationPlaceholder)
                  : t('placeholders.enter_destination_value')
              }
            />
          </Box>
        )}
      </Col>
      {isRemoveButton && (
        <Col sm={2} className="mt-4">
          <Button
            type="button"
            color="danger"
            style={{
              backgroundColor: customColors.accentRed,
              color: customColors.white,
            }}
            disabled={disabled}
            onClick={() => onPropertyRemove(position)}
          >
            <i className="fa fa-fw fa-trash me-2"></i>
            {t('actions.remove')}
          </Button>
        </Col>
      )}
    </FormGroup>
  )
}

export default GluuPropertyItem
