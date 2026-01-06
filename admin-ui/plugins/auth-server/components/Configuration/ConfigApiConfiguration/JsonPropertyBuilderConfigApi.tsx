import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Accordion, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import { generateLabel, isObject, isObjectArray } from './utils'
import customColors from '@/customColors'
import type { JsonPropertyBuilderConfigApiProps, AccordionWithSubComponents } from './types'
import type { JsonPatch } from 'JansConfigApi'
import type { AppConfiguration } from '../types'
import {
  isNumber,
  isBoolean,
  isString,
  isStringArray,
  shouldRenderAsBoolean,
  shouldRenderAsString,
  shouldRenderAsStringArray,
  shouldRenderAsNumber,
  getBooleanValue,
  getStringValue,
  getNumberValue,
  getStringArrayValue,
} from './utils'

const AccordionWithSub = Accordion as AccordionWithSubComponents
const AccordionHeader = AccordionWithSub.Header
const AccordionBody = AccordionWithSub.Body

const JsonPropertyBuilderConfigApi = ({
  propKey,
  propValue,
  lSize,
  path: initialPath,
  handler,
  parentIsArray = false,
  schema,
  doc_category = 'json_properties',
  tooltipPropKey = '',
  parent,
  disabled = false,
}: JsonPropertyBuilderConfigApiProps): JSX.Element => {
  const { t } = useTranslation()
  const [show, setShow] = useState(true)

  useEffect(() => {
    setShow(true)
  }, [propValue])

  const path = useMemo(() => {
    if (!initialPath) {
      return `/${propKey}`
    }
    if (parentIsArray && !isNaN(parseInt(propKey))) {
      return initialPath
    }
    return `${initialPath}/${propKey}`
  }, [initialPath, propKey, parentIsArray])

  const uniqueId = useMemo(() => path.replace(/\//g, '-').substring(1) || propKey, [path, propKey])

  const removeHandler = useCallback(() => {
    if (!show) {
      return
    }

    const patch: JsonPatch = {
      path,
      value: propValue,
      op: 'remove',
    }

    setShow(false)
    handler(patch)
  }, [path, propValue, handler, show])

  if (isBoolean(propValue) || shouldRenderAsBoolean(schema)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        lsize={lSize}
        rsize={lSize}
        label={generateLabel(propKey)}
        isBoolean={true}
        handler={handler}
        value={getBooleanValue(propValue, schema)}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
        showSaveButtons={false}
      />
    )
  }

  if (isString(propValue) || shouldRenderAsString(schema)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        lsize={lSize}
        rsize={lSize}
        label={generateLabel(propKey)}
        handler={handler}
        value={getStringValue(propValue, schema)}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
        showSaveButtons={false}
      />
    )
  }

  if (isNumber(propValue, schema) || shouldRenderAsNumber(schema)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        lsize={lSize}
        type="number"
        rsize={lSize}
        label={generateLabel(propKey)}
        handler={handler}
        value={getNumberValue(propValue, schema)}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
        showSaveButtons={false}
      />
    )
  }

  if (isStringArray(propValue) || shouldRenderAsStringArray(schema)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        label={generateLabel(propKey)}
        value={getStringArrayValue(propValue, schema)}
        lsize={lSize}
        rsize={lSize}
        isArray={true}
        handler={handler}
        options={schema?.items?.enum || getStringArrayValue(propValue, schema)}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
        showSaveButtons={false}
      />
    )
  }

  if (isObjectArray(propValue)) {
    if (
      !Array.isArray(propValue) ||
      propValue.length === 0 ||
      typeof propValue[0] !== 'object' ||
      propValue[0] === null
    ) {
      return <></>
    }
    const arrayValue = propValue as AppConfiguration[]
    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <AccordionHeader
          style={{
            color: customColors.lightBlue,
          }}
        >
          {generateLabel(propKey)}
        </AccordionHeader>
        <AccordionBody>
          {arrayValue.map((item, index) => {
            const itemPath = `${path}/${index}`
            const itemObj = item as AppConfiguration
            const itemIdentifier =
              (itemObj.directory as string) || (itemObj.name as string) || `item-${index}`
            const stableKey = `${path}-${itemIdentifier}`
            return (
              <JsonPropertyBuilderConfigApi
                key={stableKey}
                propKey={String(index)}
                propValue={item}
                handler={handler}
                lSize={lSize}
                parentIsArray={true}
                parent={propKey}
                path={itemPath}
                doc_category={doc_category}
                disabled={disabled}
              />
            )
          })}
        </AccordionBody>
      </Accordion>
    )
  }

  if (isObject(propValue)) {
    const isArrayItem = !isNaN(parseInt(propKey))
    const displayLabel = isArrayItem
      ? `${generateLabel(parent || propKey)} ${parseInt(propKey) + 1}`
      : generateLabel(propKey)

    return (
      <>
        {show && (
          <Accordion className="mb-2 b-primary" initialOpen>
            <AccordionHeader
              style={{
                color: customColors.lightBlue,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <span>{displayLabel}</span>
                {parentIsArray && (
                  <Button
                    style={{
                      backgroundColor: disabled ? customColors.darkGray : customColors.accentRed,
                      color: customColors.white,
                      border: 'none',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.6 : 1,
                    }}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeHandler()
                    }}
                    disabled={disabled}
                    aria-disabled={disabled}
                  >
                    <i className="fa fa-remove me-2" />
                    {t('actions.remove')}
                  </Button>
                )}
              </div>
            </AccordionHeader>
            <AccordionBody>
              {Object.keys(propValue as AppConfiguration)?.map((objKey) => {
                let tooltipKey = ''

                if (isNaN(parseInt(propKey))) {
                  tooltipKey = `${propKey}.${objKey}`
                } else if (parent) {
                  tooltipKey = `${parent}.${objKey}`
                }

                const nestedValue = (propValue as AppConfiguration)[objKey]
                return (
                  <JsonPropertyBuilderConfigApi
                    key={objKey}
                    propKey={objKey}
                    tooltipPropKey={tooltipKey}
                    propValue={nestedValue}
                    handler={handler}
                    lSize={lSize}
                    parentIsArray={parentIsArray}
                    path={path}
                    doc_category={doc_category}
                    disabled={disabled}
                  />
                )
              })}
            </AccordionBody>
          </Accordion>
        )}
      </>
    )
  }

  return <></>
}

export default JsonPropertyBuilderConfigApi
