import React, { useState } from 'react'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import GluuLabel from '../Gluu/GluuLabel'

function AttributeForm({ item, customOnSubmit }) {
  const [init, setInit] = useState(false)
  const [validation, setValidation] = useState(getInitialState(item))

  function handleValidation() {
    setValidation(!validation)
  }

  function getInitialState(item) {
    return (
      item.attributeValidation &&
      item.attributeValidation.regexp != null &&
      item.attributeValidation.minLength != null &&
      item.attributeValidation.maxLength != null
    )
  }

  function toogle() {
    if (!init) {
      setInit(true)
    }
  }

  return (
    <Formik
      initialValues={{
        name: item.name,
        displayName: item.displayName,
        description: item.displayName,
        status: item.status,
        dataType: item.dataType,
        editType: item.editType,
        viewType: item.viewType,
        usageType: item.usageType,
        jansHideOnDiscovery: item.jansHideOnDiscovery,
        oxMultiValuedAttribute: item.oxMultiValuedAttribute,
        attributeValidation: item.attributeValidation,
        scimCustomAttr: item.scimCustomAttr,
      }}
      validationSchema={Yup.object({
        name: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
        displayName: Yup.string()
          .min(2, 'Mininum 2 characters')
          .required('Required!'),
        description: Yup.string().required('Required!'),
        status: Yup.string().required('Required!'),
        dataType: Yup.string().required('Required!'),
        editType: Yup.array().required('Required!'),
        usageType: Yup.array().required('Required!')
      })}
      onSubmit={(values) => {
        const result = Object.assign(item, values)
        result['attributeValidation'].maxLength = result.maxLength
        result['attributeValidation'].minLength = result.minLength
        result['attributeValidation'].regexp = result.regexp
        customOnSubmit(JSON.stringify(result))
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          {/* START Input */}
          {item.inum && (
            <FormGroup row>
              <Label for="name" sm={3}>
                Inum
              </Label>
              <Col sm={9}>
                <Input
                  style={{ backgroundColor: '#F5F5F5' }}
                  placeholder="Enter the attribute inum"
                  id="inum"
                  name="inum"
                  disabled
                  value={item.inum}
                />
              </Col>
            </FormGroup>
          )}
          <FormGroup row>
            <GluuLabel label="Name" required />
            <Col sm={9}>
              <Input
                placeholder="Enter the attribute name"
                id="name"
                valid={!formik.errors.name && !formik.touched.name && init}
                name="name"
                defaultValue={item.name}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
              <ErrorMessage name="name">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Display Name" required />
            <Col sm={9}>
              <InputGroup>
                <Input
                  placeholder="Enter the attribute display name"
                  valid={
                    !formik.errors.displayName &&
                    !formik.touched.displayName &&
                    init
                  }
                  id="displayName"
                  name="displayName"
                  defaultValue={item.displayName}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <ErrorMessage name="displayName">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Description" required />
            <Col sm={9}>
              <InputGroup>
                <Input
                  type="textarea"
                  rows="3"
                  placeholder="Enter the attribute description"
                  id="description"
                  name="description"
                  defaultValue={item.description}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <ErrorMessage name="description">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Status" required />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="status"
                  name="status"
                  defaultValue={item.status}
                  onChange={formik.handleChange}
                >
                  <option value="">Choose...</option>
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                </CustomInput>
              </InputGroup>
              <ErrorMessage name="status">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Data Type" required />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="dataType"
                  name="dataType"
                  defaultValue={item.dataType}
                  onChange={formik.handleChange}
                >
                  <option value="">Choose...</option>
                  <option>STRING</option>
                  <option>JSON</option>
                  <option>NUMERIC</option>
                  <option>BINARY</option>
                  <option>CERTIFICATE</option>
                  <option>DATE</option>
                  <option>BOOLEAN</option>
                </CustomInput>
              </InputGroup>
              <ErrorMessage name="dataType">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Edit Type" required />
            <Col sm={9}>
              <Input
                type="select"
                name="editType"
                id="editType"
                defaultValue={item.editType}
                multiple
                onChange={formik.handleChange}
              >
                <option>ADMIN</option>
                <option>USER</option>
              </Input>
              <ErrorMessage name="editType">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="View Type" />
            <Col sm={9}>
              <Input
                type="select"
                name="viewType"
                id="viewType"
                defaultValue={item.viewType}
                multiple
                onChange={formik.handleChange}
              >
                <option>ADMIN</option>
                <option>USER</option>
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Usage Type" required/>
            <Col sm={9}>
              <Input
                type="select"
                name="usageType"
                id="usageType"
                defaultValue={item.usageType}
                multiple
                onChange={formik.handleChange}
              >
                <option>Not Defined</option>
                <option>OPENID</option>
              </Input>
              <ErrorMessage name="usageType">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="oxAuth claim name" />
            <Col sm={9}>
              <Input
                name="claimName"
                id="claimName"
                defaultValue={item.claimName}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Multivalued?" size={3} />
            <Col sm={1}>
              <Input
                id="oxMultiValuedAttribute"
                name="oxMultiValuedAttribute"
                onChange={formik.handleChange}
                type="checkbox"
                defaultChecked={item.oxMultiValuedAttribute}
              />
            </Col>
            <GluuLabel label="Hide On Discovery?" size={3} />
            <Col sm={1}>
              <Input
                id="jansHideOnDiscovery"
                name="jansHideOnDiscovery"
                onChange={formik.handleChange}
                type="checkbox"
                defaultChecked={item.jansHideOnDiscovery}
              />
            </Col>
            <GluuLabel label="Include In SCIM Extension?" size={3} />
            <Col sm={1}>
              <Input
                id="scimCustomAttr"
                name="scimCustomAttr"
                onChange={formik.handleChange}
                type="checkbox"
                defaultChecked={item.scimCustomAttr}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="Enable custom validation for this attribute?"
              size={6}
            />
            <Col sm={6}>
              <Input
                id="validation"
                name="validation"
                onChange={handleValidation}
                type="checkbox"
                defaultChecked={validation}
              />
            </Col>
          </FormGroup>

          {validation && (
            <FormGroup row>
              <GluuLabel label="Regular expression" />
              <Col sm={9}>
                <Input
                  name="regexp"
                  id="regexp"
                  defaultValue={item.attributeValidation.regexp}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          )}
          {validation && (
            <FormGroup row>
              <GluuLabel label="Minimum length" />
              <Col sm={3}>
                <Input
                  name="minLength"
                  id="minLength"
                  type="number"
                  defaultValue={item.attributeValidation.minLength}
                  onChange={formik.handleChange}
                />
              </Col>
              <GluuLabel label="Maximum length" />
              <Col sm={3}>
                <Input
                  name="maxLength"
                  id="maxLength"
                  type="number"
                  defaultValue={item.attributeValidation.maxLength}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          )}
          <FormGroup row>
            <GluuLabel label="Saml1 Uri" />
            <Col sm={9}>
              <Input
                placeholder="Enter the saml1 Uri"
                id="saml1Uri"
                name="saml1Uri"
                defaultValue={item.saml1Uri}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="Saml2 Uri" />
            <Col sm={9}>
              <Input
                placeholder="Enter the saml2 Uri"
                id="saml2Uri"
                name="saml2Uri"
                defaultValue={item.saml2Uri}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
          <GluuFooter />
        </Form>
      )}
    </Formik>
  )
}

export default AttributeForm
