import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  Button
} from "shards-react";

const Register = () => (
  <Container fluid className="main-content-container h-100 px-4">
    <Row noGutters className="h-100">
      <Col lg="3" md="5" className="auth-form mx-auto my-auto">
        <Card>
          <CardBody>
            {/* Logo */}
            <img
              className="auth-form__logo d-table mx-auto mb-3"
              src={require("../images/shards-dashboards-logo.svg")}
              alt="Shards Dashboards - Register Template"
            />

            {/* Title */}
            <h5 className="auth-form__title text-center mb-4">
              Reset Password
            </h5>

            {/* Form Fields */}
            <Form>
              <FormGroup>
                <label htmlFor="exampleInputEmail1">Email address</label>
                <FormInput
                  type="email"
                  id="exampleInputEmail1"
                  placeholder="Enter email"
                  autoComplete="email"
                />
                <small className="form-text text-muted text-center">
                  You will receive an email with a unique token.
                </small>
              </FormGroup>
              <Button
                pill
                theme="accent"
                className="d-table mx-auto"
                type="submit"
              >
                Reset Password
              </Button>
            </Form>
          </CardBody>
        </Card>

        {/* Meta Details */}
        <div className="auth-form__meta d-flex mt-4">
          <Link to="/login" className="mx-auto">
            Take me back to login.
          </Link>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Register;
