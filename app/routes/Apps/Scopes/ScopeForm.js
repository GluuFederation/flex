import React, { useState } from 'react'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Input,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import GluuLabel from '../Gluu/GluuLabel'

function ScopeForm({ scope, handleSubmit }) {
  function getInitialState(scope) {
    return scope.scopeType != null && scope.scopeType === 'openid'
  }
  const [init, setInit] = useState(false)
  const [validation, setValidation] = useState(getInitialState(scope))

  function handleValidation() {
    console.log(' handleValidation validation = ' + validation)
    setValidation(!validation)
  }

  function toogle() {
    if (!init) {
      setInit(true)
    }
  }

  return (
    <Formik
      initialValues={{
        id: scope.id,
        displayName: scope.displayName,
        description: scope.description,
        scopeType: scope.scopeType,
        defaultScope: scope.defaultScope,
        groupClaims: scope.groupClaims,
        attributes: scope.attributes,
      }}
      validationSchema={Yup.object({
        displayName: Yup.string()
          .min(2, 'displayName 2 characters')
          .required('Required!'),
        scopeType: Yup.string()
          .min(2, 'Please select scopeType')
          .required('Required!'),
      })}
      onSubmit={(values) => {
        const result = Object.assign(scope, values)
        console.log(
          'ID 1 - scope id = ' + scope.id + ' , result(id) = ' + result['id'],
        )
        const spontaneousClientScopesList = []
        if (
          result.spontaneousClientScopes != null &&
          result.spontaneousClientScopes.trim().length > 0
        ) {
          var myArray = result.spontaneousClientScopes.split(',')
          console.log('myArray.length = ' + myArray.length)
          Object.keys(myArray).forEach((key, index) => {
            spontaneousClientScopesList.push(myArray[key])
          })
          console.log(
            'spontaneousClientScopesList = ' + spontaneousClientScopesList,
          )
        }
        if (scope.id == null || scope.id == 'undefined') {
          result['id'] = result.displayName
          console.log(
            'ID 2 - scope id = ' + scope.id + ' , result(id) = ' + result['id'],
          )
        }
        result['attributes'].spontaneousClientId = result.spontaneousClientId
        result[
          'attributes'
        ].spontaneousClientScopes = spontaneousClientScopesList
        result['attributes'].showInConfigurationEndpoint =
          result.showInConfigurationEndpoint
        handleSubmit(JSON.stringify(result))
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          {/* START Input */}
          {scope.inum && (
            <FormGroup row>
              <GluuLabel label="Inum" />
              <Col sm={9}>
                <Input
                  style={{ backgroundColor: '#F5F5F5' }}
                  id="inum"
                  name="inum"
                  disabled
                  value={scope.inum}
                />
              </Col>
            </FormGroup>
          )}

          <FormGroup row>
            <GluuLabel label="DisplayName" required />
            <Col sm={9}>
              <Input
                placeholder="Enter the displayName"
                id="displayName"
                valid={
                  !formik.errors.displayName &&
                  !formik.touched.displayName &&
                  init
                }
                name="displayName"
                defaultValue={scope.displayName}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
            <ErrorMessage name="displayName">
              {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
            </ErrorMessage>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="Description" />
            <Col sm={9}>
              <Input
                type="textarea"
                placeholder="Enter the description"
                maxLength="4000"
                id="description"
                name="description"
                defaultValue={scope.description}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="Scope Type" required />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="scopeType"
                  name="scopeType"
                  defaultValue={scope.scopeType}
                  onChange={formik.handleChange}
                >
                  <option value="">Choose...</option>
                  <option value="openid">OpenID</option>
                  <option value="dynamic">Dynamic</option>
                  <option value="spontaneous">Spontaneous</option>
                  <option value="oauth">OAuth</option>
                </CustomInput>
              </InputGroup>
            </Col>
            <ErrorMessage name="scopeType">
              {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
            </ErrorMessage>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="Default Scope" size={3} />
            <Col sm={9}>
              <Input
                id="defaultScope"
                name="defaultScope"
                type="checkbox"
                onChange={formik.handleChange}
                defaultChecked={scope.defaultScope}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="SpontaneousClientId" />
            <Col sm={9}>
              <Input
                placeholder="Enter spontaneousClientId"
                id="spontaneousClientId"
                name="spontaneousClientId"
                defaultValue={scope.attributes.spontaneousClientId}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="ShowInConfigurationEndpoint" />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="showInConfigurationEndpoint"
                  name="showInConfigurationEndpoint"
                  defaultValue={scope.attributes.showInConfigurationEndpoint}
                  onChange={formik.handleChange}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </CustomInput>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="SpontaneousClientScopes   - Enter comma sperated scopes" />
            <Col sm={9}>
              <Input
                style={{ backgroundColor: '#F5F5F5' }}
                id="spontaneousClientScopes"
                name="spontaneousClientScopes"
                defaultValue={scope.attributes.spontaneousClientScopes}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row></FormGroup>
          <GluuFooter />
        </Form>
      )}
    </Formik>
  )
}

export default ScopeForm
