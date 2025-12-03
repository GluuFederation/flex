import { useState, useContext, useEffect } from 'react'
import { FormGroup, Col, Button, Accordion, AccordionHeader, AccordionBody } from 'Components'
import GluuPropertyItem from './GluuPropertyItem'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { HelpOutline } from '@mui/icons-material'
import customColors from '@/customColors'

// Property type definitions
type KeyValueProperty = { key: string; value: string }
type SourceDestinationProperty = { source: string; destination: string }
type Property = KeyValueProperty | SourceDestinationProperty

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
}: any) {
  const [properties, setProperties] = useState(options)
  const { t, i18n } = useTranslation()
  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  // Sync internal state with options prop when it changes
  // This ensures the component properly resets when formik values are reset
  useEffect(() => {
    setProperties(options)
  }, [options])

  const addProperty = () => {
    let item: Property
    if (multiProperties) {
      item = { source: '', destination: '' }
    } else if (!isKeys) {
      item = { key: '', value: '' }
    } else {
      item = { key: '', value: '' }
    }
    const newProperties = [...properties, item]
    setProperties(newProperties)

    // Sync with formik using value1/value2 format for API compatibility
    if (formik && compName) {
      if (!isKeys && !multiProperties) {
        const valuesOnly = newProperties.map((property: KeyValueProperty) => property.value)
        formik.setFieldValue(compName, valuesOnly)
      } else if (!multiProperties) {
        const apiFormat = newProperties.map((p: KeyValueProperty) => ({
          value1: p.key,
          value2: p.value,
        }))
        formik.setFieldValue(compName, apiFormat)
      } else {
        formik.setFieldValue(compName, newProperties)
      }
    }
  }
  const changeProperty = (position: any, e: any) => {
    const { name, value } = e.target
    const newDataArr = [...properties]
    newDataArr[position] = { ...newDataArr[position], [name]: value }
    setProperties(newDataArr)

    // Sync with formik using value1/value2 format for API compatibility
    if (formik && compName) {
      if (!isKeys && !multiProperties) {
        const valuesOnly = newDataArr.map((item: KeyValueProperty) => item.value)
        formik.setFieldValue(compName, valuesOnly)
      } else if (!multiProperties) {
        const apiFormat = newDataArr.map((p: KeyValueProperty) => ({
          value1: p.key,
          value2: p.value,
        }))
        formik.setFieldValue(compName, apiFormat)
      } else {
        formik.setFieldValue(compName, newDataArr)
      }
    }
  }
  const removeProperty = (position: any) => {
    const data = [...properties]
    data.splice(position, 1)
    setProperties(data)

    // Sync with formik using value1/value2 format for API compatibility
    if (formik && compName) {
      if (!isKeys && !multiProperties) {
        const valuesOnly = data.map((item: KeyValueProperty) => item.value)
        formik.setFieldValue(compName, valuesOnly)
      } else if (!multiProperties) {
        const apiFormat = data.map((p: KeyValueProperty) => ({
          value1: p.key,
          value2: p.value,
        }))
        formik.setFieldValue(compName, apiFormat)
      } else {
        formik.setFieldValue(compName, data)
      }
    }
  }

  function TooltipHeader() {
    return (
      <AccordionHeader>
        <h5 className="d-flex" aria-label={label}>
          {t(label)}

          {tooltip && i18n.exists(tooltip) && (
            <>
              <ReactTooltip
                id={tooltip}
                place="right"
                role="tooltip"
                style={{ zIndex: 101, maxWidth: '45vw' }}
              >
                {t(tooltip)}
              </ReactTooltip>
              <HelpOutline
                tabIndex={-1}
                style={{ width: 18, height: 18, marginLeft: 6, marginRight: 6 }}
                data-tooltip-id={tooltip}
                data-for={tooltip}
              />
            </>
          )}
        </h5>
      </AccordionHeader>
    )
  }

  return (
    <Accordion className="mb-2 b-primary" initialOpen>
      {tooltip ? <TooltipHeader /> : <AccordionHeader>{t(label).toUpperCase()}</AccordionHeader>}
      <AccordionBody>
        {isAddButton && (
          <Button
            style={{
              float: 'right',
            }}
            type="button"
            color={`primary-${selectedTheme}`}
            onClick={addProperty}
            disabled={disabled}
          >
            <i className="fa fa-fw fa-plus me-2"></i>
            {buttonText ? t(buttonText) : t('actions.add_property')}
          </Button>
        )}
        <FormGroup row>
          <Col sm={12}>
            <FormGroup row></FormGroup>
            {properties.map((item: any, index: any) => (
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
        {showError ? <div style={{ color: customColors.accentRed }}>{errorMessage}</div> : null}
      </AccordionBody>
    </Accordion>
  )
}
export default GluuProperties
