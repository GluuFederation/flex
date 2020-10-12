import React from "react";
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
import { Link } from "react-router-dom";

const Register = () => (
  <Container fluid className="main-content-container h-100 px-4">
    <Row noGutters className="h-100">
      <Col lg="3" md="5" className="auth-form mx-auto my-auto">
        <Card>
          <CardBody>
            <img
              className="auth-form__logo d-table mx-auto mb-3"
              src={require("../images/logo.png")}
              alt="oxTrust User Registration"
            />
            <h5 className="auth-form__title text-center mb-4">
              User registration
            </h5>
            <Form>
              <FormGroup>
                <label htmlFor="exampleInputEmail1">Email address</label>
                <FormInput
                  type="email"
                  id="exampleInputEmail1"
                  placeholder="Enter email"
                  autoComplete="email"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="exampleInputPassword1">Password</label>
                <FormInput
                  type="password"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  autoComplete="new-password"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="exampleInputPassword2">Repeat Password</label>
                <FormInput
                  type="password"
                  id="exampleInputPassword2"
                  placeholder="Repeat Password"
                  autoComplete="new-password"
                />
              </FormGroup>
              <Button
                pill
                theme="accent"
                className="d-table mx-auto"
                type="submit"
              >
                Create Account
              </Button>
            </Form>
          </CardBody>
        </Card>
        <div className="auth-form__meta d-flex mt-4">
          <Link to="/forgot-password">Forgot your password?</Link>
          <Link to="/login" className="ml-auto">
            Login page?
          </Link>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Register;
