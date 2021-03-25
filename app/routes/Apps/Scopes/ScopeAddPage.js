import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, CardBody, Card } from "./../../../components";
import ScopeForm from "./ScopeForm";
import { addScope } from "../../../redux/actions/ScopeActions";


function ScopeAddPage({ dispatch }) {
	
  const history = useHistory();
  function handleSubmit(data) {
	  console.log('ScopeAdd :  handleSubmit() - data = '+data)
    if (data) {
      //dispatch(addScope({'scope': data}));
    	dispatch(addScope(data));
      history.push("/scopes");
    }
  }
  
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <ScopeForm item={new Object()} handleSubmit={handleSubmit}
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}
const mapStateToProps = state => {
  return {
	loading: state.scopeReducer.loading,
    hasApiError: state.scopeReducer.hasApiError
  };
};
export default connect(mapStateToProps)(ScopeAddPage);

