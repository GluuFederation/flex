import React from "react";
import { connect } from "react-redux";
import { Container, CardBody, Card } from "./../../../components";
import AttributeForm from "./AttributeForm";
import BlockUi from "react-block-ui";
//import "react-block-ui/style.css";
import { editAttribute } from "../../../redux/actions/AttributeActions";

function AttributeEditPage({ item, loading, dispatch }) {
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
            <BlockUi
              tag="div"
              blocking={loading}
              keepInView={true}
              message={"Performing the request, please wait!"}
            >
              <AttributeForm item={item} handleSubmit={handleSubmit} />
            </BlockUi>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}
const mapStateToProps = state => {
  return {
    item: state.attributeReducer.item,
    loading: state.attributeReducer.loading
  };
};
export default connect(mapStateToProps)(AttributeEditPage);
