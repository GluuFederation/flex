import React, { useState } from 'react'
import { Accordion, FormGroup, Col, Button } from '../../../../app/components'
import GluuInlineInput from '../../../../app/routes/Apps/Gluu/GluuInlineInput'
import { useTranslation } from 'react-i18next'

function JsonPropertyBuilder({
  propKey,
  propValue,
  lSize,
  path,
  handler,
  parentIsArray,
}) {
  const { t } = useTranslation()
  const [show, setShow] = useState(true)
  if (!path) {
    path = '/' + propKey
  } else {
    path = path + '/' + propKey
  }
  function isBoolean(item) {
    return typeof item === 'boolean'
  }

  function isString(item) {
    return typeof item === 'string'
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
      Array.isArray(item) && item.length >= 1 && typeof item[0] === 'string'
    )
  }

  function isObjectArray(item) {
    return (
      Array.isArray(item) && item.length >= 1 && typeof item[0] === 'object'
    )
  }
  function isObject(item) {
    return typeof item === 'object'
  }

  if (isBoolean(propValue)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        lsize={lSize}
        rsize={lSize}
        label={propKey}
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
        label={propKey}
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
        label={propKey}
        handler={handler}
        value={propValue}
        parentIsArray={parentIsArray}
        path={path}
      />
    )
  }
  if (isStringArray(propValue)) {
    return (
      <GluuInlineInput
        id={propKey}
        name={propKey}
        label={propKey}
        value={propValue}
        lsize={lSize}
        rsize={lSize}
        isArray={true}
        handler={handler}
        options={propValue}
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
          <FormGroup row>
            <Col sm={11} md={11}></Col>
            <Col sm={1} md={1}>
              <Button color="primary" size="sm" style={{ float: 'right' }}>
                <i className="fa fa-plus mr-2"></i>
                {'  '}
                {t('actions.add')}
                {'  '}
              </Button>
            </Col>
          </FormGroup>
          {Object.keys(propValue).map((item, idx) => (
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
                      <i className="fa fa-remove mr-2"></i>
                      {'  '}
                      {t('actions.remove')}
                      {'  '}
                    </Button>
                  </Col>
                </FormGroup>
              )}
              {Object.keys(propValue).map((objKey, idx) => (
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

export default JsonPropertyBuilder
