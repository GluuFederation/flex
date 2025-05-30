// @ts-nocheck
import React, { useState, useContext } from 'react'
import { FormGroup, Col, Button, Accordion } from 'Components'
import GluuPropertyItem from './GluuPropertyItem'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import PropTypes from 'prop-types'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { HelpOutline } from '@mui/icons-material'

function GluuProperties({
  compName,
  label,
  formik = null,
  keyPlaceholder,
  valuePlaceholder,
  options,
  disabled = false,
  buttonText = null,
  isInputLables = false,
  keyLabel = '',
  valueLabel = '',
  isAddButton = true,
  isRemoveButton = true,
  isKeys = true,
  multiProperties = false,
  showError = false,
  errorMessage,
  inputSm,
  sourcePlaceholder,
  destinationPlaceholder,
  tooltip,
}) {
  const [properties, setProperties] = useState(options)
  const { t, i18n } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  const addProperty = () => {
    let item
    if (multiProperties) {
      item = { source: '', destination: '' }
    } else {
      item = { key: '', value: '' }
    }
    setProperties((prev) => [...prev, item])
  }
  const changeProperty = (position, e) => {
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
      data.filter((element) => element != null)
    )
  }

  function TooltipHeader() {
    return (
      <Accordion.Header>

        <h5 className='d-flex' aria-label={label}>{t(label)}

        {tooltip &&
          i18n.exists(tooltip) && (
            <>
              <ReactTooltip
                tabIndex='-1'
                id={tooltip}
                place='right'
                role='tooltip'
                style={{ zIndex: 101, maxWidth: '45vw' }}
              >
                {t(tooltip)}
              </ReactTooltip>
              <HelpOutline
                tabIndex='-1'
                style={{ width: 18, height: 18, marginLeft: 6, marginRight: 6 }}
                data-tooltip-id={tooltip} 
                data-for={tooltip}
              />
            </>
          )}
          </h5>
      </Accordion.Header>
    )
  }

  return (
    <Accordion className='mb-2 b-primary' initialOpen>
      {tooltip ? (
        <TooltipHeader />
      ) : (
        <Accordion.Header>{t(label).toUpperCase()}</Accordion.Header>
      )}
      <Accordion.Body>
        {isAddButton && (
          <Button
            style={{
              float: 'right',
            }}
            type='button'
            color={`primary-${selectedTheme}`}
            onClick={addProperty}
            disabled={disabled}
          >
            <i className='fa fa-fw fa-plus me-2'></i>
            {buttonText ? t(buttonText) : t('actions.add_property')}
          </Button>
        )}
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
                    multiProperties={multiProperties}
                    onPropertyChange={changeProperty}
                    onPropertyRemove={removeProperty}
                    isInputLables={isInputLables}
                    keyLabel={keyLabel}
                    valueLabel={valueLabel}
                    sm={inputSm}
                    isRemoveButton={isRemoveButton}
                    isKeys={isKeys}
                    sourcePlaceholder={sourcePlaceholder}
                    destinationPlaceholder={destinationPlaceholder}
                  ></GluuPropertyItem>
                )}
              </div>
            ))}
          </Col>
        </FormGroup>
        {showError ? <div style={{ color: 'red' }}>{errorMessage}</div> : null}
      </Accordion.Body>
    </Accordion>
  )
}

export default GluuProperties
GluuProperties.propTypes = {
  compName: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.object,
  keyPlaceholder: PropTypes.string,
  valuePlaceholder: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  buttonText: PropTypes.string,
  isInputLables: PropTypes.bool,
  keyLabel: PropTypes.string,
  valueLabel: PropTypes.string,
  isAddButton: PropTypes.bool,
  isRemoveButton: PropTypes.bool,
  isKeys: PropTypes.bool,
  multiProperties: PropTypes.bool,
  showError: PropTypes.bool,
  errorMessage: PropTypes.string,
  inputSm: PropTypes.any,
  sourcePlaceholder: PropTypes.string,
  destinationPlaceholder: PropTypes.string,
}