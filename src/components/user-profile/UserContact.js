import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormTextarea,
  Button
} from "shards-react";

const UserContact = ({ title }) => (
  <Card small className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
      <div className="block-handle" />
    </CardHeader>
    <CardBody>
      <Form>
        <FormTextarea
          cols="30"
          rows="6"
          className="mb-3"
          style={{ minHeight: "150px" }}
        />
        <Button type="submit" size="sm" theme="accent">
          Send Message
        </Button>
      </Form>
    </CardBody>
  </Card>
);

UserContact.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

UserContact.defaultProps = {
  title: "Send Message"
};

export default UserContact;
