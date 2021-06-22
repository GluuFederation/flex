import React from 'react'
import { Accordion } from '../../../../app/components'
import GluuInlineInput from '../../../../app/routes/Apps/Gluu/GluuInlineInput'

function JsonPropertyBuilder({ propKey, propValue, lSize, handler }) {
  function isBoolean(item) {
    return typeof item === 'boolean'
  }

  function isString(item) {
    return typeof item === 'string'
  }

  function isNumber(item) {
    return typeof item === 'number' || typeof item === 'bigint'
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
      />
    )
  }
  if (isObjectArray(propValue)) {
    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <Accordion.Header className="text-primary">
          {propKey.toUpperCase()}
        </Accordion.Header>
        <Accordion.Body>
          {Object.keys(propValue).map((item, idx) => (
            <JsonPropertyBuilder
              key={idx}
              propKey={item}
              propValue={propValue[item]}
              handler={handler}
              lSize={lSize}
            />
          ))}
        </Accordion.Body>
      </Accordion>
    )
  }
  if (isObject(propValue)) {
    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <Accordion.Header className="text-primary">
          {propKey.toUpperCase().length > 2 ? propKey.toUpperCase() : ''}
        </Accordion.Header>
        <Accordion.Body>
          {Object.keys(propValue).map((objKey, idx) => (
            <JsonPropertyBuilder
              key={idx}
              propKey={objKey}
              propValue={propValue[objKey]}
              handler={handler}
              lSize={lSize}
            />
          ))}
        </Accordion.Body>
      </Accordion>
    )
  }
  return <div></div>
}

export default JsonPropertyBuilder
