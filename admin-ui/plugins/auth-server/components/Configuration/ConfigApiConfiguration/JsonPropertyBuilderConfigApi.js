import React, { useState } from 'react'
import { Accordion, FormGroup, Col, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { generateLabel, isObject, isObjectArray } from '../JsonPropertyBuilder'

function pascalToCamel(s) {
  // Check if the string is non-empty
  if (!s) return ''

  // Convert first character to lowercase
  return s.charAt(0).toLowerCase() + s.slice(1)
}

function _isNumber(item) {
  return typeof item === 'number' || typeof item === 'bigint'
}

function _isBoolean(item, schema) {
  return typeof item === 'boolean' || schema?.type === 'boolean'
}

function _isString(item, schema) {
  return typeof item === 'string' || schema?.type === 'string'
}

function isStringArray(item, schema) {
  return (
    (Array.isArray(item) &&
      item.length >= 1 &&
      typeof item[0] === 'string') ||
    (schema?.type === 'array' && schema?.items?.type === 'string')
  )
}

function JsonPropertyBuilderConfigApi({
  propKey,
  propValue,
  lSize,
  path,
  handler,
  parentIsArray,
  schema,
  doc_category = 'json_properties',
  tooltipPropKey = '',
}) {
  const { t } = useTranslation()
  const [show, setShow] = useState(true)
  if (!path) {
    path = '/' + propKey
  } else {
    path = path + '/' + propKey
  }

  const removeHandler = () => {
    let patch = {}
    patch = {
      path,
      value: propValue,
      op: 'remove'
    }
    handler(patch)
    setShow(false)
  }

  if (_isBoolean(propValue, schema)) {
    return (
      <GluuInlineInput
        id={propKey}
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
        id={propKey}
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
        id={propKey}
        name={tooltipPropKey || propKey}
        lsize={lSize}
        type='number'
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
        id={propKey}
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
      <Accordion className='mb-2 b-primary' initialOpen>
        <Accordion.Header className='text-primary'>
          <GluuLabel
            label={generateLabel(propKey)}
            size={lSize}
            required={false}
            doc_category={doc_category}
            doc_entry={`${propKey}.self`}
          />
        </Accordion.Header>
        <Accordion.Body>
          {Object.keys(propValue)?.map((item, idx) => {
            return (
              <JsonPropertyBuilderConfigApi
                key={item}
                propKey={item}
                propValue={propValue[item]}
                handler={handler}
                lSize={lSize}
                parentIsArray={true}
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
          <Accordion className='mb-2 b-primary' initialOpen>
            <Accordion.Header className='text-primary'>
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
                      color='danger'
                      size='sm'
                      style={{ float: 'right' }}
                      onClick={removeHandler}
                    >
                      <i className='fa fa-remove me-2'></i>
                      {'  '}
                      {t('actions.remove')}
                      {'  '}
                    </Button>
                  </Col>
                </FormGroup>
              )}
              {Object.keys(propValue)?.map((objKey, idx) => {
                const tooltipPropKey = propValue?.constructor?.name
                  ? `${pascalToCamel(propValue?.constructor?.name)}.${objKey}`
                  : objKey
                return (
                  <JsonPropertyBuilderConfigApi
                    key={objKey}
                    propKey={objKey}
                    tooltipPropKey={tooltipPropKey}
                    propValue={propValue[objKey]}
                    handler={handler}
                    lSize={lSize}
                    parentIsArray={parentIsArray}
                    enableRemove={parentIsArray}
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

JsonPropertyBuilderConfigApi.propTypes = {
  schema: PropTypes.shape({ items: PropTypes.any, type: PropTypes.string }),
  propKey: PropTypes.string,
  propValue: PropTypes.any,
  lSize: PropTypes.number,
  path: PropTypes.string,
  handler: PropTypes.func,
  parentIsArray: PropTypes.bool,
  doc_category: PropTypes.string,
  tooltipPropKey: PropTypes.string,
}

export default JsonPropertyBuilderConfigApi
