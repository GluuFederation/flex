import React, { useState, useCallback, useMemo } from 'react'
import { Accordion, FormGroup, Col, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import { getIn } from 'formik'
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

const ERROR_CONTAINER_STYLE: React.CSSProperties = {
  marginTop: '-1.75rem',
  marginBottom: 0,
}

const FORM_GROUP_STYLE: React.CSSProperties = {
  marginBottom: 0,
  marginTop: 0,
}

const ERROR_COL_STYLE: React.CSSProperties = {
  paddingTop: 0,
  paddingBottom: 0,
}

const ERROR_TEXT_STYLE: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  lineHeight: '1.2',
  paddingTop: '2px',
  fontSize: '12px',
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
  errors,
  touched,
}: JsonPropertyBuilderProps): JSX.Element => {
  const { t } = useTranslation()
  const [show, setShow] = useState<boolean>(true)

  const path = initialPath ? `${initialPath}/${propKey}` : `/${propKey}`

  const formikPath = useMemo(() => {
    if (!path) return propKey
    return path.replace(/^\//, '').replace(/\//g, '.')
  }, [path, propKey])

  const fieldError = useMemo(() => {
    if (!errors) return undefined
    // For top-level fields, directly access the error
    const error = errors[propKey] || getIn(errors, formikPath)
    return error
  }, [errors, formikPath, propKey])

  const fieldTouched = useMemo(() => {
    if (!touched) return false
    // For top-level fields, directly check touched status
    const isTouched = touched[propKey] === true || getIn(touched, formikPath) === true
    return isTouched
  }, [touched, formikPath, propKey])

  const renderError = useCallback(() => {
    // Show error if field is touched and has an error
    if (!fieldTouched) return null
    if (!fieldError) return null
    if (typeof fieldError === 'object' && fieldError !== null) return null

    const errorMessage = String(fieldError)
    if (!errorMessage || errorMessage.trim() === '') return null

    return (
      <div style={ERROR_CONTAINER_STYLE}>
        <FormGroup row style={FORM_GROUP_STYLE}>
          <Col sm={10}>
            <FormGroup row style={FORM_GROUP_STYLE}>
              <Col sm={lSize}></Col>
              <Col sm={lSize} style={ERROR_COL_STYLE}>
                <div className="text-danger small" style={ERROR_TEXT_STYLE}>
                  {errorMessage}
                </div>
              </Col>
            </FormGroup>
          </Col>
        </FormGroup>
      </div>
    )
  }, [fieldTouched, fieldError, lSize])

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
      <>
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
        {renderError()}
      </>
    )
  }

  if (isString(propValue) || shouldRenderAsString(schema)) {
    return (
      <>
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
        {renderError()}
      </>
    )
  }

  if (isNumber(propValue)) {
    return (
      <>
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
        {renderError()}
      </>
    )
  }

  if (isStringArray(propValue) || isEmptyArray(propValue) || shouldRenderAsStringArray(schema)) {
    return (
      <>
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
        {renderError()}
      </>
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
                errors={errors}
                touched={touched}
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
                  errors={errors}
                  touched={touched}
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
