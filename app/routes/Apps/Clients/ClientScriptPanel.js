import React from 'react'
import {
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  CustomInput,
} from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'

function ClientScriptPanel({ client, scripts, formik }) {
  scripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => !item.enabled)
    .map((item) => item.name)
  return <Container>Client Scripts here</Container>
}

export default ClientScriptPanel
