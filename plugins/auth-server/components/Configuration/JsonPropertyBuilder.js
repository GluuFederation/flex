import React from 'react'
import { Accordion } from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuArrayCompleter from '../../../../app/routes/Apps/Gluu/GluuArrayCompleter'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'

function JsonPropertyBuilder({ propKey, propValue, lSize, logger }) {
  if (logger) {
    console.log('========key ' + JSON.stringify(propKey))
    console.log('========value ' + JSON.stringify(propValue))
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
      <GluuBooleanBox
        id={propKey}
        lsize={lSize}
        rsize={lSize}
        label={propKey}
        value={propValue}
      />
    )
  }
  if (isString(propValue)) {
    return (
      <GluuInput
        id={propKey}
        lsize={lSize}
        rsize={lSize}
        label={propKey}
        value={propValue}
      />
    )
  }
  if (isNumber(propValue)) {
    return (
      <GluuInput
        id={propKey}
        lsize={lSize}
        type="number"
        rsize={lSize}
        label={propKey}
        value={propValue}
      />
    )
  }
  if (isStringArray(propValue)) {
    return (
      <GluuArrayCompleter
        id={propKey}
        name={propKey}
        label={propKey}
        value={propValue}
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
