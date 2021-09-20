import React from 'react'
import { FormGroup, Col, Input, Button } from '../../../components'
import { useTranslation } from 'react-i18next'

function GluuPropertyItem({
  name,
  property,
  position,
  keyPlaceholder,
  valuePlaceholder,
  onPropertyChange,
  onPropertyRemove,
}) {
  const { t } = useTranslation()
  return (
    <FormGroup row>
      <Col sm={4}>
        <Input
          name={'key' + position}
          defaultValue={property.key}
          onChange={onPropertyChange(position)}
          placeholder={
            keyPlaceholder
              ? t(keyPlaceholder)
              : t('placeholders.enter_property_key')
          }
        />
      </Col>
      <Col sm={6}>
        <Input
          name={'value' + position}
          defaultValue={property.value}
          onChange={onPropertyChange(position)}
          placeholder={
            valuePlaceholder
              ? t(valuePlaceholder)
              : t('placeholders.enter_property_value')
          }
        />
      </Col>
      <Col sm={2}>
        <Button
          type="button"
          color="danger"
          onClick={() => onPropertyRemove(position)}
        >
          <i className="fa fa-fw fa-trash mr-2"></i>
          {t('actions.remove')}
        </Button>
      </Col>
    </FormGroup>
  )
}

export default GluuPropertyItem
