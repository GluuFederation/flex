import React, { Component } from "react";
import ViewRedirect from "./ViewRedirect";
import { withRouter } from "react-router";
import { saveState, isValidState } from "./TokenController";

// -----Third party dependencies -----
import queryString from "query-string";

// ------------ Custom Resources -----
import { uuidv4 } from "./Util";

// ------------ Redux ----------------
import { connect } from "react-redux";
import {
  getOAuth2Config,
  getUserInfo,
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
    saveState(state);
    return url;
  };

  // Life Cycle
  constructor() {
    super();
  }

  static getDerivedStateFromProps(props) {
    if (!props.showContent) {
      console.log("user info: " + JSON.stringify(props.userinfo));
      console.log("jwt: " + JSON.stringify(props.jwt));
      if (!props.userinfo) {
        const params = queryString.parse(props.location.search);
        let showContent = false;
        if (params.code && params.scope && params.state) {
          if (!isValidState(params.state)) {
            return {
              showContent: false
            };
          }
          props.getUserInfo(params.code);
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
          //props.getAPIAccessToken();
        }
        return {
          showContent: true
        };
      }
    } else {
      return { showContent: true };
    }
  }
  render() {
    const { showContent } = this.state;
    return (
      <React.Fragment>
        {showContent && this.props.children}
        {!showContent && <ViewRedirect config={this.props.config} />}
      </React.Fragment>
    );
  }
}

// Redux

const mapStateToProps = ({ authReducer }) => {
  const config = authReducer.config;
  const userinfo = authReducer.userinfo;
  const jwt = authReducer.userinfo_jwt;
  return {
    config,
    userinfo,
    jwt
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getOAuth2Config,
    getUserInfo,
    getAPIAccessToken
  })(SessionChecker)
);
