import React from 'react'
import {
  Badge,
  Col,
  Form,
  FormGroup,
  Container,
  Accordion,
  Input,
  Card,
  CardText,
  CardBody,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuArrayCompleter from '../../../../app/routes/Apps/Gluu/GluuArrayCompleter'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'

function JsonPropertyBuilder({ propKey, propValue, lSize }) {
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
    return Array.isArray(item) && item.length>1 &&  typeof item[0] === 'string'
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
  return <div></div>
}

export default JsonPropertyBuilder
