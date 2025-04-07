import React, { useState } from 'react'
import { Accordion, FormGroup, Col, Button } from 'Components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

export function generateLabel(name) {
  const result = name.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}
export function isObjectArray(item) {
  return (
    Array.isArray(item) && item.length >= 1 && typeof item[0] === 'object'
  )
}

export function isObject(item) {
  if (item != null) {
    return typeof item === 'object'
  } else {
    return false
  }
}
function JsonPropertyBuilder({
  propKey,
  propValue,
  lSize,
  path,
  handler,
  parentIsArray,
  schema
}) {
  const { t } = useTranslation()
  const [show, setShow] = useState(true)
  if (!path) {
    path = '/' + propKey
  } else {
    path = path + '/' + propKey
  }
  function isBoolean(item) {
    return typeof item === 'boolean' || schema?.type === 'boolean'
  }

  function isString(item) {
    return typeof item === 'string' || schema?.type === 'string'
  }

  function isNumber(item) {
    return typeof item === 'number' || typeof item === 'bigint'
  }
  const removeHandler = () => {
    const patch = {}
    patch['path'] = path
    patch['value'] = propValue
    patch['op'] = 'remove'
    handler(patch)
    setShow(false)
  }

  function isStringArray(item) {
    return (
      (Array.isArray(item) && item.length >= 1 && typeof item[0] === 'string') || (schema?.type === 'array' && schema?.items?.type === 'string')
    )
  }

  function isEmptyArray(item) {
    return (
      (Array.isArray(item) && item.length === 0) ||
      (schema?.type === "array" && schema?.items?.type === "string")
    )
  }

  if (isBoolean(propValue)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        lsize={lSize}
        rsize={lSize}
        label={generateLabel(propKey)}
        isBoolean={true}
        handler={handler}
        value={propValue}
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
        label={generateLabel(propKey)}
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
        label={generateLabel(propKey)}
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
        label={generateLabel(propKey)}
        value={propValue || []}
        lsize={lSize}
        rsize={lSize}
        isArray={true}
        handler={handler}
        options={schema?.items?.enum || propValue || []}
        parentIsArray={parentIsArray}
        path={path}
      />
    )
  }

  if (isObjectArray(propValue)) {
    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <Accordion.Header className="text-primary">
          {propKey.toUpperCase()}{' '}
        </Accordion.Header>
        <Accordion.Body>
          {Object.keys(propValue)?.map((item, idx) => (
            <JsonPropertyBuilder
              key={idx}
              propKey={item}
              propValue={propValue[item]}
              handler={handler}
              lSize={lSize}
              parentIsArray={true}
              path={path}
            />
          ))}
        </Accordion.Body>
      </Accordion>
    )
  }
  if (isObject(propValue)) {
    return (
      <div>
        {show && (
          <Accordion className="mb-2 b-primary" initialOpen>
            <Accordion.Header className="text-primary">
              {propKey.toUpperCase().length > 10 ? propKey.toUpperCase() : ''}
            </Accordion.Header>
            <Accordion.Body>
              {parentIsArray && (
                <FormGroup row>
                  <Col sm={11} md={11}></Col>
                  <Col sm={1} md={1}>
                    <Button
                      color="danger"
                      size="sm"
                      style={{ float: 'right' }}
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
              {Object.keys(propValue)?.map((objKey, idx) => (
                <JsonPropertyBuilder
                  key={idx}
                  propKey={objKey}
                  propValue={propValue[objKey]}
                  handler={handler}
                  lSize={lSize}
                  parentIsArray={parentIsArray}
                  enableRemove={parentIsArray}
                  path={path}
                />
              ))}
            </Accordion.Body>
          </Accordion>
        )}
      </div>
    )
  }
  return <div></div>
}

JsonPropertyBuilder.propTypes = {
  schema: PropTypes.shape({ items: PropTypes.any, type: PropTypes.string })
}

export default JsonPropertyBuilder
