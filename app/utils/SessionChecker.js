import React, { Component } from "react";
import ViewRedirect from "./ViewRedirect";
import { withRouter } from "react-router";

// -----Third party dependencies -----
import queryString from "query-string";

// ------------ Custom Resources -----
import { uuidv4 } from "./Util";

// ------------ Redux ----------------
import { connect } from "react-redux";
import {
  getOAuth2Config,
  getOAuth2AccessToken,
  getAPIAccessToken
} from "../redux/actions";

class SessionChecker extends Component {
  state = {
    showContent: false
  };

  // Methods

  static buildAuthzUrl = config => {
    const {
      authzBaseUrl,
      clientId,
      scope,
      redirectUrl,
      responseType,
      acrValues
    } = config;
    const state = uuidv4();
    const nonce = uuidv4();
    if (
      !authzBaseUrl ||
      !clientId ||
      !scope ||
      !redirectUrl ||
      !responseType ||
      !acrValues ||
      !state ||
      !nonce
    ) {
      console.warn("Parameters to process authz code flow are missing.");
      return;
    }
    const url = `${authzBaseUrl}?acr_values=${acrValues}&response_type=${responseType}
     &redirect_uri=${redirectUrl}&client_id=${clientId}&scope=${scope}&state=${state}&nonce=${nonce}`;
    localStorage.setItem("flow.state", state);
    localStorage.setItem("flow.nonce", nonce);
    return url;
  };

  // Life Cycle

  constructor() {
    super();
  }

  static getDerivedStateFromProps(props) {
    if (!props.showContent) {
      console.log("===============1");
      const accessToken = localStorage.getItem("gluu.access.token");
      localStorage.removeItem("gluu.api.token");
      
      console.log("===============1-1" + accessToken);
      if (!accessToken) {
        console.log("===============1-2");
        const params = queryString.parse(props.location.search);
        let showContent = false;
        if (params.code && params.scope && params.state) {
          console.log("===============1-2-1");
          props.getOAuth2AccessToken(params.code);
        } else {
          console.log("===============1-3");
          showContent = !!props.config;
          console.log("===============1-4" + showContent);
          if (showContent) {
            console.log("===============1-4-1");
            const authzUrl = SessionChecker.buildAuthzUrl(props.config);
            if (authzUrl) {
              console.log("Url to process authz: ", authzUrl);
              window.location.href = authzUrl;
              return null;
            }
          } else {
            console.log("===============1-5");
            props.getOAuth2Config();
          }
        }
        return {
          showContent: false
        };
      } else {
        const apiToken = localStorage.getItem("gluu.api.token");
        if (!apiToken) {
          console.log("***************************Api access token");
          props.getAPIAccessToken();
        }
        return {
          showContent: true
        };
      }
    } else {
      console.log("===============2");
      return { showContent: true };
    }
  }
  render() {
    const { showContent } = this.state;
    return (
      <React.Fragment>
        {showContent && this.props.children}
        {!showContent && <ViewRedirect />}
      </React.Fragment>
    );
  }
}

// Redux

const mapStateToProps = ({ authReducer }) => {
  const isAuthenticated = authReducer.isAuthenticated;
  const hasApiToken = authReducer.hasApiToken;
  const hasUserToken = authReducer.hasUserToken;
  const config = authReducer.config;
  return {
    isAuthenticated,
    hasApiToken,
    hasUserToken,
    config
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getOAuth2Config,
    getOAuth2AccessToken,
    getAPIAccessToken
  })(SessionChecker)
);
