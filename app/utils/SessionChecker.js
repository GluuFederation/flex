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
      const accessToken = localStorage.getItem("gluu.access.token");
      if (!accessToken) {
        const params = queryString.parse(props.location.search);
        let showContent = false;
        if (params.code && params.scope && params.state) {
          props.getOAuth2AccessToken(params.code);
        } else {
          showContent = !!props.config;
          if (showContent) {
            const authzUrl = SessionChecker.buildAuthzUrl(props.config);
            if (authzUrl) {
              console.log("Url to process authz: ", authzUrl);
              window.location.href = authzUrl;
              return null;
            }
          } else {
            props.getOAuth2Config();
          }
        }
        return {
          showContent: false
        };
      } else {
        const apiToken = localStorage.getItem("gluu.api.token");
        if (!apiToken) {
          props.getAPIAccessToken();
        }
        return {
          showContent: true
        };
      }
    } else {
      return { showContent: true };
    }
  }
  render(props) {
    const { showContent } = this.state;
    return (
      <React.Fragment>
        {showContent && this.props.children}
        {!showContent && <ViewRedirect config={this.props} />}
      </React.Fragment>
    );
  }
}

// Redux

const mapStateToProps = ({ authReducer }) => {
  const isAuthenticated = authReducer.isAuthenticated;
  const config = authReducer.config;
  return {
    isAuthenticated,
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
