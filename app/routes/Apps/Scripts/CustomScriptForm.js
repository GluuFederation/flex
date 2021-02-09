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
function CustomScriptForm({ item, handleSubmit }) {
  const [init, setInit] = useState(false);
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
      programmingLanguage: item.programmingLanguage
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
        .required("Required!")
    }),
    onSubmit: values => {
      const result = Object.assign(item, values);
      handleSubmit(JSON.stringify(result));
    }
  });
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

      <FormGroup row>
        <GluuLabel label="Script Type" />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="scriptType"
              name="scriptType"
              defaultValue={item.scriptType}
              onChange={formik.handleChange}
            >
              <option value="">Choose...</option>
              <option>PERSON_AUTHENTICATION</option>
              <option>INTROSPECTION</option>
              <option>RESOURCE_OWNER_PASSWORD_CREDENTIALS</option>
              <option>APPLICATION_SESSION</option>
              <option>CACHE_REFRESH</option>
              <option>UPDATE_USER</option>
              <option>USER_REGISTRATION</option>
              <option>CLIENT_REGISTRATION</option>
              <option>ID_GENERATOR</option>
              <option>UMA_RPT_POLICY</option>
              <option>UMA_RPT_CLAIMS</option>
              <option>UMA_CLAIMS_GATHERING</option>
              <option>CONSENT_GATHERING</option>
              <option>DYNAMIC_SCOPE</option>
              <option>SPONTANEOUS_SCOPE</option>
              <option>END_SESSION</option>
              <option>POST_AUTHN</option>
              <option>SCIM</option>
              <option>CIBA_END_USER_NOTIFICATION</option>
              <option>PERSISTENCE_EXTENSION</option>
              <option>IDP</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Programming Language" />
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
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Script" />
        <Col sm={9}>
          <Input
            name="script"
            id="script"
            defaultValue={item.script}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Level" />
        <Col sm={9}>
          <Input
            name="level"
            id="level"
            defaultValue={item.level}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Revision" />
        <Col sm={9}>
          <Input
            name="revision"
            id="revision"
            defaultValue={item.revision}
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

      <FormGroup row></FormGroup>
      <GluuFooter />
    </Form>
  );
}

export default CustomScriptForm;
