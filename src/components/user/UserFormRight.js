import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, ListGroup, ListGroupItem, Row } from "shards-react";
import UserClaimsTab from "./UserClaimsTab";
const UserFormRight = ({ title, handler }) => (
  <Card small className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <UserClaimsTab handler={handler} />
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

UserFormRight.propTypes = {
  title: PropTypes.string
};

UserFormRight.defaultProps = {
  title: "User claims"
};

export default UserFormRight;
