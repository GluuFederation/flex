import { useState, useEffect, useRef } from 'react'
import { FormGroup, Col, Button, Accordion, AccordionHeader, AccordionBody } from 'Components'
import GluuPropertyItem from './GluuPropertyItem'
import { useTranslation } from 'react-i18next'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { HelpOutline } from '@mui/icons-material'
import customColors from '@/customColors'
import { isDevelopment } from '@/utils/env'

// Property type definitions
type KeyValueProperty = { key: string; value: string }
type SourceDestinationProperty = { source: string; destination: string }
type Property = KeyValueProperty | SourceDestinationProperty

const isKeyValueProperty = (prop: Property): prop is KeyValueProperty =>
  'key' in prop && 'value' in prop

const isSourceDestinationProperty = (prop: Property): prop is SourceDestinationProperty =>
  'source' in prop && 'destination' in prop

const syncFormikProperties = (
  formik: any,
  compName: string,
  properties: Property[],
  { isKeys, multiProperties }: { isKeys: boolean; multiProperties: boolean },
) => {
  if (!formik || !compName) return

  if (isDevelopment && properties.length > 0) {
    const hasKeyValue = properties.some((p: any) => 'key' in p && 'value' in p)
    const hasSourceDest = properties.some((p: any) => 'source' in p && 'destination' in p)
    const hasApiFormat = properties.some((p: any) => 'value1' in p && 'value2' in p)

    if (multiProperties && !hasSourceDest) {
      console.warn(
        `GluuProperties[${compName}]: multiProperties=true but properties lack source/destination`,
      )
    }
    if (!multiProperties && !hasKeyValue && hasApiFormat) {
      console.error(
        `GluuProperties[${compName}]: Properties in API format {value1,value2}. Transform to {key,value} before passing to component.`,
      )
    }
  }

  if (!isKeys && !multiProperties) {
    const valuesOnly = properties.filter(isKeyValueProperty).map((item) => item.value)
    if (isDevelopment && valuesOnly.length < properties.length) {
      console.warn(
        `GluuProperties[${compName}]: Filtered out ${properties.length - valuesOnly.length} properties due to type mismatch`,
      )
    }
    formik.setFieldValue(compName, valuesOnly)
  } else if (!multiProperties) {
    const apiFormat = properties.filter(isKeyValueProperty).map((p) => ({
      value1: p.key,
      value2: p.value,
    }))
    if (isDevelopment && apiFormat.length < properties.length) {
      console.warn(
        `GluuProperties[${compName}]: Filtered out ${properties.length - apiFormat.length} properties due to type mismatch`,
      )
    }
    formik.setFieldValue(compName, apiFormat)
  } else {
    const validProperties = properties.filter(isSourceDestinationProperty)
    if (isDevelopment && validProperties.length < properties.length) {
      console.warn(
        `GluuProperties[${compName}]: Filtered out ${properties.length - validProperties.length} properties due to type mismatch`,
      )
    }
    formik.setFieldValue(compName, validProperties)
  }
}

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

  const formikRef = useRef(formik)
  formikRef.current = formik
  const initialSyncDone = useRef(false)

  useEffect(() => {
    setProperties(options)
    if (!initialSyncDone.current && options?.length > 0) {
      syncFormikProperties(formikRef.current, compName, options, { isKeys, multiProperties })
      initialSyncDone.current = true
    }
  }, [options, compName, isKeys, multiProperties])

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
    syncFormikProperties(formik, compName, newProperties, { isKeys, multiProperties })
  }

  const changeProperty = (position: any, e: any) => {
    const { name, value } = e.target
    const newDataArr = [...properties]
    newDataArr[position] = { ...newDataArr[position], [name]: value }
    setProperties(newDataArr)
    syncFormikProperties(formik, compName, newDataArr, { isKeys, multiProperties })
  }
  const removeProperty = (position: any) => {
    const data = [...properties]
    data.splice(position, 1)
    setProperties(data)
    syncFormikProperties(formik, compName, data, { isKeys, multiProperties })
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
              backgroundColor: customColors.primaryDark,
              color: customColors.white,
              border: 'none',
            }}
            type="button"
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
