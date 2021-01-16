import React, { Component } from "react";
import ViewRedirect from "./ViewRedirect";
import { withRouter } from "react-router";

// -----Third party dependencies -----
import queryString from "query-string";

// ------------ Custom Resources -----
import { uuidv4 } from "./Util";

// ------------ Redux ----------------
import { connect } from "react-redux";
import { getOAuth2Config, getOAuth2AccessToken } from "../redux/actions";

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
    return url;
  };

  // Life Cycle

  constructor() {
    super();
  }

  static getDerivedStateFromProps(props) {
    if (!props.loading) {
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
          showContent
        };
      } else {
        return {
          showContent: true
        };
      }
    }
    return null;
  }
  componentDidMount() {}
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
  const loading = authReducer.loading;
  const config = authReducer.config;
  return {
    loading,
    config
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getOAuth2Config,
    getOAuth2AccessToken
  })(SessionChecker)
);
