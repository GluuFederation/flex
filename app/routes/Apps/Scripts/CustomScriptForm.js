import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input
} from "./../../../components";
import GluuFooter from "../Gluu/GluuFooter";
import GluuLabel from "../Gluu/GluuLabel";
import Counter from '../../../components/Widgets/GroupedButtons/Counter'
function CustomScriptForm({ item, scripts, handleSubmit }) {
  const [init, setInit] = useState(false);
  const [scriptTypeState, setScriptTypeState] = useState(item.scriptType);
  const scriptTypes = [...(new Set(scripts.map(item => item.scriptType)))];
  function toogle() {
    if (!init) {
      setInit(true);
    }
  }
  const formik = useFormik({
    initialValues: {
      name: item.name,
      description: item.description,
      scriptType: item.scriptType,
      programmingLanguage: item.programmingLanguage,
      level: item.level,
      script: item.script,
      aliases: item.aliases,
      moduleProperties: item.moduleProperties,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Mininum 2 characters")
        .required("Required!"),
      description: Yup.string(),
      scriptType: Yup.string()
        .min(2, "Mininum 2 characters")
        .required("Required!"),
      programmingLanguage: Yup.string()
        .min(3, "This value is required")
        .required("Required!"),
      script: Yup.string()
        .required("Required!")
    }),

    onSubmit: values => {
      values.level = item.level;
      values.moduleProperties = item.moduleProperties;
      if (typeof values.enabled == 'object') {
        if (values.enabled.length > 0) {
          values.enabled = true;
        } else {
          values.enabled = false;
        }
      }

      const result = Object.assign(item, values);
      const reqBody = { customScript: result };

      handleSubmit(reqBody);
    }
  });

  function locationTypeChange(value) {
    if (value != '') {

      if (!item.moduleProperties) {
        item.moduleProperties = [];
      }

      if (item.moduleProperties.filter((item) => item.value1 === 'location_type').length > 0) {
        item.moduleProperties.splice(item.moduleProperties.findIndex((item) => item.value1 === 'location_type'), 1);
      }
      item.moduleProperties.push({ "value1": "location_type", "value2": value, "description": "" });
    }
  }

  function usageTypeChange(value) {
    if (value != '') {

      if (!item.moduleProperties) {
        item.moduleProperties = [];
      }

      if (item.moduleProperties.filter((item) => item.value1 === 'usage_type').length > 0) {
        item.moduleProperties.splice(item.moduleProperties.findIndex((item) => item.value1 === 'usage_type'), 1);
      }
      item.moduleProperties.push({ "value1": "usage_type", "value2": value, "description": "" });
    }
  }

  function onLevelChange(level) {
    item.level = level;
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      {/* START Input */}
      {item.inum && (
        <FormGroup row>
          <Label for="name" sm={3}>
            Inum
          </Label>
          <Col sm={9}>
            <Input
              style={{ backgroundColor: "#F5F5F5" }}
              placeholder="Enter the script inum"
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
            placeholder="Enter the script name"
            id="name"
            valid={!formik.errors.name && !formik.touched.name && init}
            name="name"
            defaultValue={item.name}
            onKeyUp={toogle}
            onChange={formik.handleChange}
          />
          {formik.errors.name && formik.touched.name ? (
            <div style={{ color: 'red' }}>{formik.errors.name}</div>
          ) : null}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Description" />
        <Col sm={9}>
          <InputGroup>
            <Input
              placeholder="Enter script description"
              valid={
                !formik.errors.description &&
                !formik.touched.description &&
                init
              }
              id="description"
              defaultValue={item.description}
              onChange={formik.handleChange}
            />
          </InputGroup>
        </Col>
      </FormGroup>
      {scriptTypeState === 'PERSON_AUTHENTICATION' &&
        <FormGroup row>
          <GluuLabel label="Select SAML ACRS" />
          <Col sm={9}>
            <Input
              type="select"
              name="aliases"
              id="aliases"
              defaultValue={item.aliases}
              multiple
              onChange={formik.handleChange}
            >
              <option value="urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocol">urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocol</option>
              <option value="urn:oasis:names:tc:SAML:2.0:ac:classes:Password">urn:oasis:names:tc:SAML:2.0:ac:classes:Password</option>
              <option value="urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport">urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</option>
            </Input>
          </Col>
        </FormGroup>}

      <FormGroup row>
        <GluuLabel label="Script Type" required />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="scriptType"
              name="scriptType"
              defaultValue={item.scriptType}
              onChange={(e) => {
                setScriptTypeState(e.target.value);
                formik.setFieldValue('scriptType', e.target.value);
              }}
            >
              <option value="">Choose...</option>
              {scriptTypes.map((item, index) => (<option key={index} value={item}>{item}</option>))}
            </CustomInput>
          </InputGroup>
          {formik.errors.scriptType && formik.touched.scriptType ? (
            <div style={{ color: 'red' }}>{formik.errors.scriptType}</div>
          ) : null}
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Programming Language" required />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="programmingLanguage"
              name="programmingLanguage"
              defaultValue={item.programmingLanguage}
              onChange={formik.handleChange}
            >
              <option value="">Choose...</option>
              <option>PYTHON</option>
              <option>JAVASCRIPT</option>
            </CustomInput>
          </InputGroup>
          {formik.errors.programmingLanguage && formik.touched.programmingLanguage ? (
            <div style={{ color: 'red' }}>{formik.errors.programmingLanguage}</div>
          ) : null}
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Location Type" />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="location_type"
              name="location_type"
              defaultValue={(!!item.moduleProperties && item.moduleProperties.filter((item) => item.value1 === 'location_type').length > 0) ?
                (item.moduleProperties.filter((item) => item.value1 === 'location_type')[0]).value2 : undefined}
              onChange={(e) => { locationTypeChange(e.target.value) }}>
              <option value="">Choose...</option>
              <option value="ldap">Database</option>
              <option value="file">File</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>
      {scriptTypeState === 'PERSON_AUTHENTICATION' &&
        <FormGroup row>
          <GluuLabel label="Interactive" />
          <Col sm={9}>
            <InputGroup>
              <CustomInput
                type="select"
                id="usage_type"
                name="usage_type"
                defaultValue={(!!item.moduleProperties && item.moduleProperties.filter((item) => item.value1 === 'usage_type').length > 0) ?
                (item.moduleProperties.filter((item) => item.value1 === 'usage_type')[0]).value2 : undefined}
                onChange={(e) => { usageTypeChange(e.target.value) }}>
                <option value="">Choose...</option>
                <option value="interactive">Web</option>
                <option value="service">Native</option>
                <option value="both">Both methods</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>}

      <FormGroup row>
        <GluuLabel label="Level" />
        <Col sm={9}>
          <Counter counter={item.level} onCounterChange={(level) => onLevelChange(level)} />
          <Input
            type="hidden"
            id="level"
            defaultValue={item.level}
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Script" size={3} required />
        {formik.errors.script && formik.touched.script ? (
          <div style={{ color: 'red' }}>{formik.errors.script}</div>
        ) : null}
        <Col sm={10}>
          <Input
            placeholder="Script"
            valid={
              !formik.errors.script &&
              !formik.touched.script &&
              init
            }
            type="textarea"
            rows={20}
            id="script"
            name="script"
            defaultValue={item.script}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Enabled" size={3} />
        <Col sm={1}>
          <Input
            id="enabled"
            name="enabled"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={item.enabled}
          />
        </Col>
      </FormGroup>

      <FormGroup row> <Input
        type="hidden"
        id="moduleProperties"
        defaultValue={item.moduleProperties}
      /></FormGroup>
      <GluuFooter />
    </Form>
  );
}

export default CustomScriptForm;
