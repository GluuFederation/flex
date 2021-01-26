import React from "react";
import { connect } from "react-redux";
import { Container, CardBody, Card } from "./../../../components";
import AttributeForm from "./AttributeForm";
import { editAttribute } from "../../../redux/actions/AttributeActions";

function AttributeEditPage({ item, dispatch }) {
  function handleSubmit(data) {
    if (data) {
      dispatch(editAttribute(data));
    }
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <AttributeForm item={item} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}
const mapStateToProps = state => {
  return {
    item: state.attributeReducer.item
  };
};
export default connect(mapStateToProps)(AttributeEditPage);
