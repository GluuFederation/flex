import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormSelect
} from "shards-react";
import ControlPanel from "../common/ControlPanel";

const UserFormLeft = ({ title }) => (
  <Card small className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form>
              <Row form>
                <Col md="6" className="form-group">
                  <label htmlFor="username">First Name</label>
                  <FormInput id="username" placeholder="user name" />
                </Col>
                <Col md="6" className="form-group">
                  <label htmlFor="displayname">Display Name</label>
                  <FormInput id="displayname" placeholder="display Name" />
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <FormInput id="firstName" placeholder="first name" />
                </Col>
                <Col md="6" className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <FormInput id="lastName" placeholder="last name" />
                </Col>
              </Row>

              <Row form>
                <Col md="6" className="form-group">
                  <label htmlFor="password">Password</label>
                  <FormInput
                    type="password"
                    id="password"
                    placeholder="password"
                    autoComplete="current-password"
                  />
                </Col>
                <Col md="6" className="form-group">
                  <label htmlFor="confirmpassword">Re-Password</label>
                  <FormInput
                    type="password"
                    id="confirmpassword"
                    placeholder="confirm password"
                    autoComplete="current-password"
                  />
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label htmlFor="email">Email</label>
                  <FormInput
                    type="email"
                    id="email"
                    placeholder="your email address"
                    onChange={() => {}}
                    autoComplete="email"
                  />
                </Col>
                <Col md="6" className="form-group">
                  <label htmlFor="status">Status</label>
                  <FormSelect id="feInputState">
                    <option>Choose...</option>
                    <option>Active</option>
                    <option>InActive</option>
                  </FormSelect>
                </Col>
              </Row>
              <ControlPanel />
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

UserFormLeft.propTypes = {
  title: PropTypes.string
};

UserFormLeft.defaultProps = {
  title: "User add form"
};

export default UserFormLeft;
