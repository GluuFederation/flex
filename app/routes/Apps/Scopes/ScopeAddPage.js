import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, CardBody, Card } from "./../../../components";
import ScopeForm from "./ScopeForm";
import { addScope } from "../../../redux/actions/ScopeActions";


function ScopeAddPage({  scripts, dispatch }) {
	console.log(" ScopeAddPage - scripts = "+scripts)
  
  const history = useHistory();
  function handleSubmit(data) {
	  console.log('ScopeAdd :  handleSubmit() - data = '+data)
    if (data) {
    	const postBody = {}
        postBody['scope'] = JSON.parse(data)
        dispatch(addScope(postBody))
       history.push("/scopes");
    }
  }
  
  const scope = {
		   claims: [],		   
		   defaultScope: false,
		   groupClaims: false,
		   dynamicScopeScripts: [],
		   umaAuthorizationPolicies: [],
		   attributes: { spontaneousClientId: null, spontaneousClientScopes: [], showInConfigurationEndpoint: 'false' },
		  }
  
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <ScopeForm scope={scope} handleSubmit={handleSubmit} scripts={scripts}
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
    hasApiError: state.scopeReducer.hasApiError,
    scripts: state.initReducer.scripts,
  };
};
export default connect(mapStateToProps)(ScopeAddPage);

