import React, { useState, useMemo, useCallback } from 'react'
import { Accordion, FormGroup, Col, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { generateLabel, isObject, isObjectArray } from '../JsonPropertyBuilder'
import customColors from '@/customColors'
import type { JsonPropertyBuilderConfigApiProps, AccordionWithSubComponents } from './types'
import type { JsonPatch } from 'JansConfigApi'
import { isNumber, isBoolean, isString, isStringArray } from './utils'

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

  const path = useMemo(() => {
    if (!initialPath) {
      return `/${propKey}`
    }
    return `${initialPath}/${propKey}`
  }, [initialPath, propKey])

  const uniqueId = useMemo(() => path.replace(/\//g, '-').substring(1) || propKey, [path, propKey])

  const removeHandler = useCallback(() => {
    if (disabled) {
      return
    }
    const patch: JsonPatch = {
      path,
      value: propValue,
      op: 'remove',
    }
    handler(patch)
    setShow(false)
  }, [disabled, path, propValue, handler])

  if (isBoolean(propValue, schema)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        lsize={lSize}
        rsize={lSize}
        label={generateLabel(propKey)}
        isBoolean={true}
        handler={handler}
        value={propValue}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
      />
    )
  }

  if (isString(propValue, schema)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        lsize={lSize}
        rsize={lSize}
        label={generateLabel(propKey)}
        handler={handler}
        value={propValue}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
      />
    )
  }

  if (isNumber(propValue)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        lsize={lSize}
        type="number"
        rsize={lSize}
        label={generateLabel(propKey)}
        handler={handler}
        value={propValue}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
      />
    )
  }

  if (isStringArray(propValue, schema)) {
    return (
      <GluuInlineInput
        id={uniqueId}
        name={tooltipPropKey || propKey}
        label={generateLabel(propKey)}
        value={propValue || []}
        lsize={lSize}
        rsize={lSize}
        isArray={true}
        handler={handler}
        options={schema?.items?.enum || propValue || []}
        parentIsArray={parentIsArray}
        path={path}
        doc_category={doc_category}
        disabled={disabled}
      />
    )
  }

  if (isObjectArray(propValue)) {
    const AccordionWithSub = Accordion as AccordionWithSubComponents
    const AccordionHeader = AccordionWithSub.Header
    const AccordionBody = AccordionWithSub.Body
    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <AccordionHeader
          style={{
            color: customColors.lightBlue,
          }}
        >
          <GluuLabel
            label={generateLabel(propKey)}
            size={lSize}
            required={false}
            doc_category={doc_category}
            doc_entry={`${propKey}.self`}
          />
        </AccordionHeader>
        <AccordionBody>
          {Object.keys(propValue as Record<string, unknown>)?.map((item) => {
            return (
              <JsonPropertyBuilderConfigApi
                key={item}
                propKey={item}
                propValue={(propValue as Record<string, unknown>)[item]}
                handler={handler}
                lSize={lSize}
                parentIsArray={true}
                parent={propKey}
                path={path}
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
    const AccordionWithSub = Accordion as AccordionWithSubComponents
    const AccordionHeader = AccordionWithSub.Header
    const AccordionBody = AccordionWithSub.Body
    return (
      <>
        {show && (
          <Accordion className="mb-2 b-primary" initialOpen>
            <AccordionHeader
              style={{
                color: customColors.lightBlue,
              }}
            >
              {propKey.toUpperCase().length > 2 ? (
                <GluuLabel
                  label={generateLabel(propKey)}
                  size={lSize}
                  required={false}
                  doc_category={doc_category}
                  doc_entry={`${propKey}.self`}
                />
              ) : null}
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
              {Object.keys(propValue as Record<string, unknown>)?.map((objKey) => {
                let tooltipKey = ''

                if (isNaN(parseInt(propKey))) {
                  tooltipKey = `${propKey}.${objKey}`
                } else if (parent) {
                  tooltipKey = `${parent}.${objKey}`
                }

                return (
                  <JsonPropertyBuilderConfigApi
                    key={objKey}
                    propKey={objKey}
                    tooltipPropKey={tooltipKey}
                    propValue={(propValue as Record<string, unknown>)[objKey]}
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
