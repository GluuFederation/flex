import React, { useState, useCallback } from 'react'
import { Accordion, FormGroup, Col, Button } from 'Components'
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
  }, [path, propValue, handler])

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
      />
    )
  }

  if (isObjectArray(propValue)) {
    // isObjectArray ensures propValue is an array of objects (AppConfiguration)
    // Runtime check guarantees it's an array, so this cast is safe
    const arrayValue = (Array.isArray(propValue) ? propValue : []) as AppConfiguration[]
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
          {arrayValue.map((nestedValue, index) => {
            return (
              <JsonPropertyBuilder
                key={String(index)}
                propKey={String(index)}
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
                      <i className="fa fa-remove me-2" />
                      {t('actions.remove')}
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
