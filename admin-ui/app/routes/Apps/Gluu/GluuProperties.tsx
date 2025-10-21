import { useState, useContext, useEffect } from 'react'
import { FormGroup, Col, Button, Accordion, AccordionHeader, AccordionBody } from 'Components'
import GluuPropertyItem from './GluuPropertyItem'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { HelpOutline } from '@mui/icons-material'
import customColors from '@/customColors'

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
    let item
    if (multiProperties) {
      item = { source: '', destination: '' }
    } else if (!isKeys) {
      // When isKeys is false, we only need a value (string), not an object
      item = { key: '', value: '' }
    } else {
      item = { key: '', value: '' }
    }
    setProperties((prev: any) => [...prev, item])
  }
  const changeProperty = (position: any, e: any) => {
    const { name, value } = e.target
    const newDataArr = [...properties]
    newDataArr[position] = { ...newDataArr[position], [name]: value }
    setProperties(newDataArr)

    // When isKeys is false and not using multiProperties, extract only the values as strings for formik
    if (!isKeys && !multiProperties) {
      const valuesOnly = newDataArr.map((item: any) => item.value)
      formik.setFieldValue(compName, valuesOnly)
    } else {
      formik.setFieldValue(compName, newDataArr)
    }
  }
  const removeProperty = (position: any) => {
    let data = [...properties]
    delete data[position]
    data = data.filter((element: any) => element != null)
    setProperties(data)

    // When isKeys is false and not using multiProperties, extract only the values as strings for formik
    if (!isKeys && !multiProperties) {
      const valuesOnly = data.filter((element) => element != null).map((item: any) => item.value)
      formik.setFieldValue(compName, valuesOnly)
    } else {
      formik.setFieldValue(
        compName,
        data.filter((element) => element != null),
      )
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
