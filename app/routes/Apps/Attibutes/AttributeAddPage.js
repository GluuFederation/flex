import React from "react";
import { connect } from "react-redux";
import { Container, CardBody, Card } from "./../../../components";
import AttributeForm from "./AttributeForm";
import { addAttribute } from "../../../redux/actions/AttributeActions";
function AttributeAddPage({ dispatch }) {
  function handleSubmit(data) {
    if (data) {
      dispatch(addAttribute(data));
    }
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <AttributeForm item={new Object()} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}
const mapStateToProps = state => {
  return {
    loading: state.attributeReducer.loading,
    hasApiError: state.attributeReducer.hasApiError
  };
};
export default connect(mapStateToProps)(AttributeAddPage);
