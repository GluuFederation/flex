import React, { useState } from 'react'
import { Accordion, FormGroup, Col, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { generateLabel, isObject, isObjectArray } from '../JsonPropertyBuilder'
import customColors from '@/customColors'
import type { JsonPropertyBuilderConfigApiProps } from './types'
import type { JsonPatch } from 'JansConfigApi'

function _isNumber(item: unknown): item is number {
  return typeof item === 'number' || typeof item === 'bigint'
}

function _isBoolean(
  item: unknown,
  schema?: JsonPropertyBuilderConfigApiProps['schema'],
): item is boolean {
  return typeof item === 'boolean' || schema?.type === 'boolean'
}

function _isString(
  item: unknown,
  schema?: JsonPropertyBuilderConfigApiProps['schema'],
): item is string {
  return typeof item === 'string' || schema?.type === 'string'
}

function isStringArray(
  item: unknown,
  schema?: JsonPropertyBuilderConfigApiProps['schema'],
): item is string[] {
  return (
    (Array.isArray(item) && item.length >= 1 && typeof item[0] === 'string') ||
    (schema?.type === 'array' && schema?.items?.type === 'string')
  )
}

function JsonPropertyBuilderConfigApi({
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
}: JsonPropertyBuilderConfigApiProps): JSX.Element {
  const { t } = useTranslation()
  const [show, setShow] = useState(true)

  let path = initialPath
  if (!path) {
    path = '/' + propKey
  } else {
    path = path + '/' + propKey
  }

  const uniqueId = path.replace(/\//g, '-').substring(1) || propKey

  const removeHandler = () => {
    const patch: JsonPatch = {
      path,
      value: propValue,
      op: 'remove',
    }
    handler(patch)
    setShow(false)
  }

  if (_isBoolean(propValue, schema)) {
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
      />
    )
  }

  if (_isString(propValue, schema)) {
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
      />
    )
  }

  if (_isNumber(propValue)) {
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
      />
    )
  }

  if (isObjectArray(propValue)) {
    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <Accordion.Header
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
        </Accordion.Header>
        <Accordion.Body>
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
              />
            )
          })}
        </Accordion.Body>
      </Accordion>
    )
  }

  if (isObject(propValue)) {
    return (
      <>
        {show && (
          <Accordion className="mb-2 b-primary" initialOpen>
            <Accordion.Header
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
            </Accordion.Header>
            <Accordion.Body>
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
                  />
                )
              })}
            </Accordion.Body>
          </Accordion>
        )}
      </>
    )
  }

  return <></>
}

export default JsonPropertyBuilderConfigApi
