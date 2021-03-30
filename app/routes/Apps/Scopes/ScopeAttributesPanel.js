import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Col,
  Container,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input,
  Row
} from "./../../../components";
import GluuLabel from "../Gluu/GluuLabel";
import GluuFormDetailRow from '../Gluu/GluuFormDetailRow'

function ScopeAttributesPanel({ scope,init,formik }) {
	
console.log(' ScopeAttributesPanel  - scope = '+scope+" init ="+init)
  function readValue(keys, key) {
    let res = String(keys[key])
    if (res === 'undefined') {
      return ''
    }
    return res
  }
if (scope.attributes) {
    const keys = Object.keys(scope.attributes)
    return (
    		 <Container title="Attributes">
    		
<FormGroup row>
		<GluuLabel label="spontaneousClientId" />
		<Col sm={20}>
		<Input
		placeholder="Enter Spontaneous Client Id"
			id="spontaneousClientId"
				valid={!formik.errors.spontaneousClientId && !formik.touched.spontaneousClientId && init}
		name="spontaneousClientId"
			value={scope.attributes.spontaneousClientId}
		/>
		</Col>
</FormGroup>

		

</Container>
    )
  } else {
    return <Container></Container>
  }
}

export default ScopeAttributesPanel
