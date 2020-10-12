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
import { useTranslation } from "react-i18next";
const ChangePasswordPage = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="main-content-container h-100 px-4">
      <Row noGutters className="h-100">
        <Col lg="3" md="5" className="auth-form mx-auto my-auto">
          <Card>
            <CardBody>
              <img
                className="auth-form__logo d-table mx-auto mb-3"
                src={require("../../images/logo.png")}
                alt="Change User Profile"
              />
              <h5 className="auth-form__title text-center mb-4">
                Change Password
              </h5>
              <Form>
                <FormGroup>
                  <label htmlFor="password">Password</label>
                  <FormInput
                    type="password"
                    id="password"
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="repassword">Repeat Password</label>
                  <FormInput
                    type="password"
                    id="repassword"
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
                  {t("button.changeButton")}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default ChangePasswordPage;
