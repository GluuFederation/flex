import React from "react";
import { Row, Col } from "shards-react";

const Colors = () => (
  <Row className="mb-2">
    <Col lg="12">
      <span style={{ fontSize: "16px" }} className="d-block mb-2 text-muted">
        <strong>Colors</strong>
      </span>
    </Col>

    <Col className="mb-4">
      <div
        className="bg-primary rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-secondary rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-success rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-info rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-warning rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-danger rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-dark rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-salmon rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-royal-blue rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
    <Col className="mb-4">
      <div
        className="bg-java rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
      />
    </Col>
  </Row>
);

export default Colors;
