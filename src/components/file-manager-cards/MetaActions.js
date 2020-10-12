import React from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  ButtonGroup,
  Button
} from "shards-react";

const MetaActions = () => (
  <Row noGutters className="p-2">
    <Col lg="3" className="mb-2 mb-lg-0">
      <Form action="POST">
        <InputGroup seamless size="sm">
          <InputGroupAddon type="prepend">
            <InputGroupText>
              <i className="material-icons">search</i>
            </InputGroupText>
          </InputGroupAddon>
          <FormInput />
        </InputGroup>
      </Form>
    </Col>
    <Col>
      <div className="d-flex ml-lg-auto my-auto">
        <ButtonGroup size="sm" className="mr-2 ml-lg-auto">
          <Button theme="white">
            <i className="material-icons">&#xE5CA;</i>
          </Button>
          <Button theme="white">
            <i className="material-icons">&#xE870;</i>
          </Button>
          <Button theme="white">
            <i className="material-icons">&#xE254;</i>
          </Button>
          <Button theme="white">
            <i className="material-icons">&#xE872;</i>
          </Button>
        </ButtonGroup>
        <Button
          size="sm"
          theme="accent"
          className="d-inline-block ml-auto ml-lg-0"
        >
          <i className="material-icons">&#xE145;</i> Add New
        </Button>
      </div>
    </Col>
  </Row>
);

export default MetaActions;
