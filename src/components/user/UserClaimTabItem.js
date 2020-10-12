import React from "react";
import { Row, Col, Button } from "shards-react";
const UserClaimItem = ({ handler, data }) => {
  return (
    <div>
      {data.map((item, idx) => (
        <Row form style={{ height: "30px", marginLeft: "10px" }}>
          <Col md="10" className="form-group">
            <label style={{ marginTop: "2px", fontSize: "1.5em" }}>
              {item}
            </label>
          </Col>
          <Col md="2" className="form-group">
            <Button
              style={{ float: "right" }}
              onClick={() => handler(item)}
              size="sm"
              theme="primary"
            >
              <i className="material-icons">check</i>
            </Button>
          </Col>
        </Row>
      ))}
    </div>
  );
};
export default UserClaimItem;
