import React, { useState, useCallback } from 'react'
import { Accordion, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import type {
  JsonPropertyBuilderProps,
  AccordionWithSubComponents,
  AppConfiguration,
} from './types'
import type { JsonPatch } from 'JansConfigApi'
import {
  isString,
  isStringArray,
  isEmptyArray,
  isBoolean,
  isNumber,
  shouldRenderAsBoolean,
  shouldRenderAsString,
  shouldRenderAsStringArray,
  isObjectArray,
  isObject,
  migratingTextIfRenamed,
} from './ConfigApiConfiguration/utils'

const AccordionWithSub = Accordion as AccordionWithSubComponents
const AccordionHeader = AccordionWithSub.Header
const AccordionBody = AccordionWithSub.Body

const JsonPropertyBuilder = ({
  propKey,
  propValue,
  lSize,
  path: initialPath,
  handler,
  parentIsArray = false,
  schema,
  isRenamedKey = false,
  parentKey,
  onRemoveFromArray,
}: JsonPropertyBuilderProps): JSX.Element => {
  const { t } = useTranslation()
  const [show, setShow] = useState<boolean>(true)

  const path = initialPath ? `${initialPath}/${propKey}` : `/${propKey}`

  const removeHandler = useCallback(() => {
    const patch: JsonPatch = {
      path,
      value: propValue,
      op: 'remove',
    }
    handler(patch)
    setShow(false)
    if (onRemoveFromArray) {
      onRemoveFromArray()
    }
  }, [path, propValue, handler, onRemoveFromArray])

  if (isBoolean(propValue) || shouldRenderAsBoolean(schema)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        lsize={lSize}
        rsize={lSize}
        label={migratingTextIfRenamed(isRenamedKey, propKey)}
        isBoolean={true}
        handler={handler}
        value={propValue as boolean}
        parentIsArray={parentIsArray}
        path={path}
        showSaveButtons={false}
      />
    )
  }

  if (isString(propValue) || shouldRenderAsString(schema)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        lsize={lSize}
        rsize={lSize}
        label={migratingTextIfRenamed(isRenamedKey, propKey)}
        handler={handler}
        value={propValue as string}
        parentIsArray={parentIsArray}
        path={path}
        showSaveButtons={false}
      />
    )
  }

  if (isNumber(propValue)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        lsize={lSize}
        type="number"
        rsize={lSize}
        label={migratingTextIfRenamed(isRenamedKey, propKey)}
        handler={handler}
        value={propValue}
        parentIsArray={parentIsArray}
        path={path}
        showSaveButtons={false}
      />
    )
  }

  if (isStringArray(propValue) || isEmptyArray(propValue) || shouldRenderAsStringArray(schema)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        label={migratingTextIfRenamed(isRenamedKey, propKey)}
        value={(propValue as string[]) || []}
        lsize={lSize}
        rsize={lSize}
        isArray={true}
        handler={handler}
        options={schema?.items?.enum || (propValue as string[]) || []}
        parentIsArray={parentIsArray}
        path={path}
        showSaveButtons={false}
      />
    )
  }

  if (isObjectArray(propValue)) {
    if (!Array.isArray(propValue) || propValue.length === 0) {
      return <></>
    }

    const arrayValue = propValue as AppConfiguration[]
    const [visibleCount, setVisibleCount] = useState<number>(arrayValue.length)

    const handleItemRemoved = useCallback(() => {
      setVisibleCount((prev) => (prev > 0 ? prev - 1 : 0))
    }, [])

    if (visibleCount === 0) {
      return <></>
    }

    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <AccordionHeader
          style={{
            color: customColors.lightBlue,
          }}
        >
          {propKey.toUpperCase()}
        </AccordionHeader>
        <AccordionBody>
          {arrayValue.map((nestedValue, index) => (
            <JsonPropertyBuilder
              key={`${path}-${index}`}
              propKey={String(index)}
              propValue={nestedValue}
              handler={handler}
              lSize={lSize}
              parentIsArray={true}
              path={path}
              parentKey={propKey}
              onRemoveFromArray={handleItemRemoved}
            />
          ))}
        </AccordionBody>
      </Accordion>
    )
  }

  if (isObject(propValue)) {
    const isArrayItem = !isNaN(parseInt(propKey))
    const baseLabel = parentKey || propKey
    const displayLabel = isArrayItem
      ? `${migratingTextIfRenamed(isRenamedKey, baseLabel)} ${parseInt(propKey) + 1}`
      : migratingTextIfRenamed(isRenamedKey, propKey)

    return (
      <div>
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
                      backgroundColor: customColors.accentRed,
                      color: customColors.white,
                      border: 'none',
                    }}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeHandler()
                    }}
                  >
                    <i className="fa fa-remove me-2" />
                    {t('actions.remove')}
                  </Button>
                )}
              </div>
            </AccordionHeader>
            <AccordionBody>
              {Object.keys(propValue)?.map((objKey) => (
                <JsonPropertyBuilder
                  key={objKey}
                  propKey={objKey}
                  propValue={propValue[objKey]}
                  handler={handler}
                  lSize={lSize}
                  parentIsArray={parentIsArray}
                  path={path}
                />
              ))}
            </AccordionBody>
          </Accordion>
        )}
      </div>
    )
  }

  return <></>
}

const MemoizedJsonPropertyBuilder = React.memo(JsonPropertyBuilder)

MemoizedJsonPropertyBuilder.displayName = 'JsonPropertyBuilder'

export default MemoizedJsonPropertyBuilder
