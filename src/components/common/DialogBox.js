import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Col
} from "shards-react";

const DialogBox = ({ status, handleAccept, toggle, identity }) => {
  return (
    <Modal open={status} toggle={toggle} centered={false}>
      <ModalHeader>
        <Row form style={{ height: "20px" }}>
          <Col md="2" style={{ height: "20px" }}>
            <img
              className="auth-form__logo d-table mx-auto mb-3"
              src={require("../../images/logo.png")}
              alt="Logo"
            />
          </Col>
          <Col md="10" style={{ height: "20px" }}>
            Item(s) deletion confirmation
          </Col>
        </Row>
      </ModalHeader>
      <ModalBody>👋 👋 Do you really want to delete this item?</ModalBody>
      <ModalFooter>
        <Button onClick={handleAccept}>
          <i className="material-icons">check</i> Ok
        </Button>
        <Button onClick={toggle}>
          <i className="material-icons">cancel</i>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DialogBox;
