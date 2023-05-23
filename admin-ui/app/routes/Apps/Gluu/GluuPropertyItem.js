import React from 'react'
import { FormGroup, Col, Input, Button } from 'Components'
import { useTranslation } from 'react-i18next'

function GluuPropertyItem({
  property,
  position,
  keyPlaceholder,
  valuePlaceholder,
  onPropertyChange,
  onPropertyRemove,
  disabled = false,
  isInputLables = false,
  keyLabel = "",
  valueLabel = "",
  isRemoveButton,
  isKeys,
  sm = 6,
  multiProperties = false,
  destinationPlaceholder = '',
  sourcePlaceholder = ''
}) {
  const { t } = useTranslation()
  return (
    <FormGroup row >
      {isKeys && <Col sm={4}>
        {isInputLables && <label>{keyLabel}</label>}
        <Input
          name={'key'}
          defaultValue={property.key}
          disabled={disabled}
          onChange={onPropertyChange(position)}
          placeholder={
            keyPlaceholder
              ? t(keyPlaceholder)
              : t('placeholders.enter_property_key')
          }
        />
      </Col>}
      <Col sm={sm}>
        {isInputLables && <label>{valueLabel}</label>}
        {!multiProperties ?
          <>
            <Input
              name={'value'}
              defaultValue={property.value}
              disabled={disabled}
              onChange={onPropertyChange(position)}
              placeholder={
                valuePlaceholder
                  ? t(valuePlaceholder)
                  : t('placeholders.enter_property_value')
              }
            />
          </>
          :
          <>
            <Input
              name={'source'}
              defaultValue={property.source}
              disabled={disabled}
              onChange={onPropertyChange(position)}
              placeholder={
                sourcePlaceholder
                  ? t(sourcePlaceholder)
                  : t('placeholders.enter_source_value')
              }
            />
            <Input
              name={'destination'}
              defaultValue={property.destination}
              disabled={disabled}
              onChange={onPropertyChange(position)}
              placeholder={
                destinationPlaceholder
                  ? t(destinationPlaceholder)
                  : t('placeholders.enter_destination_value')
              }
            />
          </>
        }

      </Col>
      {isRemoveButton && <Col sm={2} className="mt-4">
        <Button
          type="button"
          color="danger"
          disabled={disabled}
          onClick={() => onPropertyRemove(position)}
        >
          <i className="fa fa-fw fa-trash me-2"></i>
          {t('actions.remove')}
        </Button>
      </Col>}
    </FormGroup>
  )
}

export default GluuPropertyItem
