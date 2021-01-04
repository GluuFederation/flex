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
function AttributeForm({ data }) {
  const [init, setInit] = useState(false);
  function toogle() {
    if (!init) {
      setInit(true);
    }
  }
  const formik = useFormik({
    initialValues: { name: "", displayName: "", description: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Mininum 2 characters")
        .required("Required!"),
      displayName: Yup.string()
        .min(2, "Mininum 2 characters")
        .required("Required!"),
      description: Yup.string(),
      status: Yup.string()
        .min(1, "This value is required")
        .required("Required!")
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });
  return (
    <Form onSubmit={formik.handleSubmit}>
      {/* START Input */}
      {data && (
        <FormGroup row>
          <Label for="name" sm={3}>
            Inum
          </Label>
          <Col sm={9}>
            <Input
              style={{ backgroundColor: "#F5F5F5" }}
              placeholder="Enter the attribute inum"
              id="inum"
              name="inum"
              disabled
              value={data}
            />
          </Col>
        </FormGroup>
      )}
      <FormGroup row>
        <Label for="name" sm={3}>
          Name
        </Label>
        <Col sm={9}>
          <Input
            placeholder="Enter the attribute name"
            id="name"
            valid={!formik.errors.name && !formik.touched.name && init}
            name="name"
            onKeyUp={toogle}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="displayName" sm={3}>
          Display Name
        </Label>
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
              onChange={formik.handleChange}
            />
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="description" sm={3}>
          Description
        </Label>
        <Col sm={9}>
          <InputGroup>
            <Input
              placeholder="Enter the attribute description"
              id="description"
              onChange={formik.handleChange}
            />
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="status" sm={3}>
          Status
        </Label>
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="status"
              name="status"
              onChange={formik.handleChange}
            >
              <option value="">Choose...</option>
              <option>ACTIVE</option>
              <option>INACTIVE</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="type" sm={3}>
          Data Type
        </Label>
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="type"
              name="type"
              onChange={formik.handleChange}
            >
              <option value="">Choose...</option>
              <option>TEXT</option>
              <option>NUMERIC</option>
              <option>BINARY</option>
              <option>CERTIFICATE</option>
              <option>DATE</option>
              <option>BOOLEAN</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="editType" sm={3}>
          Edit Type
        </Label>
        <Col sm={9}>
          <Input
            type="select"
            name="editType"
            id="editType"
            multiple
            onChange={formik.handleChange}
          >
            <option>Admin</option>
            <option>User</option>
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="viewType" sm={3}>
          View Type
        </Label>
        <Col sm={9}>
          <Input
            type="select"
            name="viewType"
            id="viewType"
            multiple
            onChange={formik.handleChange}
          >
            <option>Admin</option>
            <option>User</option>
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="usageType" sm={3}>
          Usage Type
        </Label>
        <Col sm={9}>
          <Input
            type="select"
            name="usageType"
            id="usageType"
            multiple
            onChange={formik.handleChange}
          >
            <option>Not Defined</option>
            <option>OpenID</option>
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="regex" sm={3}>
          Regular expression
        </Label>
        <Col sm={9}>
          <InputGroup>
            <Input name="regex" id="regex" onChange={formik.handleChange} />
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup row></FormGroup>
      <GluuFooter />
    </Form>
  );
}

export default AttributeForm;
