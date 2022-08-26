import React, { useState, useContext } from 'react'
import { FormGroup, Col, Button } from 'Components'
import { Accordion } from 'Components'
import GluuPropertyItem from './GluuPropertyItem'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'

function GluuProperties({
  compName,
  label,
  formik = null,
  keyPlaceholder,
  valuePlaceholder,
  options,
  disabled = false,
}) {
  const [properties, setProperties] = useState(options)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  const addProperty = () => {
    const item = { key: '', value: '' }
    setProperties((prev) => [...prev, item])
  }
  const changeProperty = (position) => (e) => {
    const { name, value } = e.target
    const newDataArr = [...properties]
    newDataArr[position] = { ...newDataArr[position], [name]: value }
    setProperties(newDataArr)
    formik.setFieldValue(compName, newDataArr)
  }
  const removeProperty = (position) => {
    let data = [...properties]
    delete data[position]
    data = data.filter((element) => element != null)
    setProperties(data)
    formik.setFieldValue(
      compName,
      data.filter((element) => element != null),
    )
  }

  return (
    <Accordion className="mb-2 b-primary" initialOpen>
      <Accordion.Header>{t(label).toUpperCase()}</Accordion.Header>
      <Accordion.Body>
        <Button
          style={{
            float: 'right',
            marginTop: -40,
          }}
          type="button"
          color={`primary-${selectedTheme}`}
          onClick={addProperty}
          disabled={disabled}
        >
          <i className="fa fa-fw fa-plus mr-2"></i>
          {t('actions.add_property')}
        </Button>
        <FormGroup row>
          <Col sm={12}>
            <FormGroup row></FormGroup>
            {properties.map((item, index) => (
              <div key={index}>
                {item != null && (
                  <GluuPropertyItem
                    key={index}
                    position={index}
                    keyPlaceholder={keyPlaceholder}
                    valuePlaceholder={valuePlaceholder}
                    property={item}
                    disabled={disabled}
                    onPropertyChange={changeProperty}
                    onPropertyRemove={removeProperty}
                  ></GluuPropertyItem>
                )}
              </div>
            ))}
          </Col>
        </FormGroup>
      </Accordion.Body>
    </Accordion>
  )
}

export default GluuProperties
