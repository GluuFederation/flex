import React from "react";
import { useFormik } from "formik";
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
  const formik = useFormik({
    initialValues: { name: "", description: "" },
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
            name="name"
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
              id="displayName"
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
            <CustomInput type="select" id="status" name="status">
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
            <CustomInput type="select" id="type" name="type">
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
          <Input type="select" name="editType" id="editType" multiple>
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
          <Input type="select" name="viewType" id="viewType" multiple>
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
          <Input type="select" name="usageType" id="usageType" multiple>
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
            <Input name="text" id="regex" />
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup row></FormGroup>
      <GluuFooter />
    </Form>
  );
}

export default AttributeForm;
