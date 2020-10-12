import React, { useState } from "react";
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
  FormCheckbox,
  Button
} from "shards-react";

const LoginPage = () => {
  const [remembeMe, setRemembeMe] = useState(false);
  return (
    <Container fluid className="main-content-container h-100 px-4">
      <Row noGutters className="h-100">
        <Col lg="3" md="5" className="auth-form mx-auto my-auto">
          <Card>
            <CardBody>
              <img
                className="auth-form__logo d-table mx-auto mb-3"
                src={require("../images/logo.png")}
                alt="Oxtrust Login page"
              />
              <h5 className="auth-form__title text-center mb-4">
                Access oxTrust Admin UI
              </h5>
              <Form>
                <FormGroup>
                  <label htmlFor="userName">User Name</label>
                  <FormInput
                    type="text"
                    id="userName"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="password">Password</label>
                  <FormInput
                    type="password"
                    id="password"
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                </FormGroup>
                <FormGroup>
                  <FormCheckbox
                    id="remembeMe"
                    checked={remembeMe}
                    onChange={e => setRemembeMe(!remembeMe)}
                  >
                    Remember me for 30 days.
                  </FormCheckbox>
                </FormGroup>
                <Button
                  pill
                  theme="accent"
                  className="d-table mx-auto"
                  type="submit"
                >
                  Connect
                </Button>
              </Form>
            </CardBody>
          </Card>
          <div className="auth-form__meta d-flex mt-4">
            <Link to="/forgot-password">Forgot your password?</Link>
            <Link to="/register" className="ml-auto">
              Register new account?
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default LoginPage;
