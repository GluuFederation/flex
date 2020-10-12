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
  FormGroup,
  FormInput,
  FormSelect,
  Button
} from "shards-react";

const UserAccountDetails = ({ title }) => (
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
                  <label htmlFor="username">User Name</label>
                  <FormInput
                    id="username"
                    placeholder="User Name"
                    value="Zico"
                    onChange={() => {}}
                  />
                </Col>
                <Col md="6" className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <FormInput
                    id="displayName"
                    placeholder="Display Name"
                    value="Mohib"
                    onChange={() => {}}
                  />
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <FormInput
                    id="firstName"
                    placeholder="First Name"
                    value="Zico"
                    onChange={() => {}}
                  />
                </Col>
                <Col md="6" className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <FormInput
                    id="lastName"
                    placeholder="Last Name"
                    value="Zico"
                    onChange={() => {}}
                  />
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label htmlFor="Email">Email</label>
                  <FormInput
                    type="email"
                    id="Email"
                    placeholder="Email Address"
                    value="zico@example.com"
                    onChange={() => {}}
                    autoComplete="email"
                  />
                </Col>
                <Col md="6" className="form-group">
                  <label htmlFor="fePassword">Password</label>
                  <FormInput
                    type="password"
                    id="fePassword"
                    placeholder="Password"
                    value=""
                    onChange={() => {}}
                    autoComplete="current-password"
                  />
                </Col>
              </Row>
              <FormGroup>
                <label htmlFor="feAddress">Address</label>
                <FormInput
                  id="feAddress"
                  placeholder="Address"
                  value="Bangladesh St. 456"
                  onChange={() => {}}
                />
              </FormGroup>
              <Row form>
                {/* City */}
                <Col md="6" className="form-group">
                  <label htmlFor="city">City</label>
                  <FormInput
                    id="city"
                    placeholder="City"
                    onChange={() => {}}
                  />
                </Col>
                <Col md="4" className="form-group">
                  <label htmlFor="state">State</label>
                  <FormSelect id="state">
                    <option>Choose...</option>
                    <option>...</option>
                  </FormSelect>
                </Col>
                <Col md="2" className="form-group">
                  <label htmlFor="zipcode">Zip</label>
                  <FormInput
                    id="zipcode"
                    placeholder="Zip"
                    onChange={() => {}}
                  />
                </Col>
              </Row>
              <Button theme="accent">Update Account</Button>
              <Button theme="accent">Cancel</Button>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

UserAccountDetails.propTypes = {
  title: PropTypes.string
};

UserAccountDetails.defaultProps = {
  title: "Account Details"
};

export default UserAccountDetails;
