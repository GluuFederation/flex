import React, { useState, useCallback } from 'react'
import { Accordion, FormGroup, Col, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import type { JsonPropertyBuilderProps, AccordionWithSubComponents } from './types'
import type { JsonPatch } from 'JansConfigApi'

const AccordionWithSub = Accordion as AccordionWithSubComponents
const AccordionHeader = AccordionWithSub.Header
const AccordionBody = AccordionWithSub.Body

export function generateLabel(name: string): string {
  const result = name.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

import type { PropertyValue, AppConfiguration } from './types'

export function isObjectArray(item: PropertyValue): boolean {
  return Array.isArray(item) && item.length >= 1 && typeof item[0] === 'object'
}

export function isObject(item: PropertyValue): item is AppConfiguration {
  if (item != null) {
    return typeof item === 'object' && !Array.isArray(item)
  }
  return false
}

const migratingTextIfRenamed = (isRenamedKey: boolean, text: string): string => {
  if (isRenamedKey) {
    return text
  }
  return generateLabel(text)
}

const JsonPropertyBuilder = ({
  propKey,
  propValue,
  lSize,
  path: initialPath,
  handler,
  parentIsArray = false,
  schema,
  isRenamedKey = false,
}: JsonPropertyBuilderProps): JSX.Element => {
  const { t } = useTranslation()
  const [show, setShow] = useState<boolean>(true)

  const path = initialPath ? `${initialPath}/${propKey}` : `/${propKey}`

  const isBoolean = useCallback(
    (item: PropertyValue): boolean => {
      return typeof item === 'boolean' || schema?.type === 'boolean'
    },
    [schema],
  )

  const isString = useCallback(
    (item: PropertyValue): item is string => {
      return typeof item === 'string' || schema?.type === 'string'
    },
    [schema],
  )

  const isNumber = useCallback((item: PropertyValue): item is number => {
    return typeof item === 'number' || typeof item === 'bigint'
  }, [])

  const isStringArray = useCallback(
    (item: PropertyValue): item is string[] => {
      return (
        (Array.isArray(item) && item.length >= 1 && typeof item[0] === 'string') ||
        (schema?.type === 'array' && schema?.items?.type === 'string') === true
      )
    },
    [schema],
  )

  const isEmptyArray = useCallback(
    (item: PropertyValue): boolean => {
      return (
        (Array.isArray(item) && item.length === 0) ||
        (schema?.type === 'array' && schema?.items?.type === 'string') === true
      )
    },
    [schema],
  )

  const removeHandler = useCallback(() => {
    const patch: JsonPatch = {
      path,
      value: propValue,
      op: 'remove',
    }
    handler(patch)
    setShow(false)
  }, [path, propValue, handler])

  if (isBoolean(propValue)) {
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
      />
    )
  }

  if (isString(propValue)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        lsize={lSize}
        rsize={lSize}
        label={migratingTextIfRenamed(isRenamedKey, propKey)}
        handler={handler}
        value={propValue}
        parentIsArray={parentIsArray}
        path={path}
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
      />
    )
  }

  if (isStringArray(propValue) || isEmptyArray(propValue)) {
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
      />
    )
  }

  if (isObjectArray(propValue)) {
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
          {Object.keys(propValue as AppConfiguration)?.map((item) => {
            const nestedValue = (propValue as AppConfiguration)[item]
            return (
              <JsonPropertyBuilder
                key={item}
                propKey={item}
                propValue={nestedValue}
                handler={handler}
                lSize={lSize}
                parentIsArray={true}
                path={path}
              />
            )
          })}
        </AccordionBody>
      </Accordion>
    )
  }

  if (isObject(propValue)) {
    return (
      <div>
        {show && (
          <Accordion className="mb-2 b-primary" initialOpen>
            <AccordionHeader
              style={{
                color: customColors.lightBlue,
              }}
            >
              {propKey.toUpperCase().length > 10 ? propKey.toUpperCase() : ''}
            </AccordionHeader>
            <AccordionBody>
              {parentIsArray && (
                <FormGroup row>
                  <Col sm={11} md={11}></Col>
                  <Col sm={1} md={1}>
                    <Button
                      style={{
                        backgroundColor: customColors.accentRed,
                        color: customColors.white,
                        float: 'right',
                        border: 'none',
                      }}
                      size="sm"
                      onClick={removeHandler}
                    >
                      <i className="fa fa-remove me-2"></i>
                      {'  '}
                      {t('actions.remove')}
                      {'  '}
                    </Button>
                  </Col>
                </FormGroup>
              )}
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

export default JsonPropertyBuilder
