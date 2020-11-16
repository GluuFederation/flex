import React, { Component } from "react";

// ------------ Custom Resources -----
import { uuidv4 } from './Util';

// ------------ Redux ----------------
import { connect } from "react-redux";
import { getOAuth2Config } from "../redux/actions";

class SessionChecker extends Component {

  state = {
    showContent: false
  }

  // Methods

  static buildAuthzUrl = (config) => {
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

    if (!authzBaseUrl || !clientId || !scope || !redirectUrl || !responseType || !responseType || !acrValues || !state || !nonce) {
      console.warn('Parameters to process authz code flow are missing.');
      return;
    }

    return `${authzBaseUrl}?scope=${scope}&acr_values=${acrValues}&response_type=${responseType}
    &redirect_uri=${redirectUrl}&client_id=${clientId}&state=${state}&nonce=${nonce}`;
  }

  // Life Cycle

  constructor() {
    super();
  }

  static getDerivedStateFromProps(props, state) {
    const accessToken = localStorage.getItem("gluu.access.token");
    if (!accessToken) {
      const showContent = !!props.config;
      if (showContent) {
        const authzUrl = SessionChecker.buildAuthzUrl(props.config);
        if (authzUrl) {
          console.log('Url to process authz: ', authzUrl);
  
          window.location.href = authzUrl;
          return null;
        }
      } else {
        this.props.getOAuth2Config();
      }
      return { showContent }
    } else {
      return { showContent: true };
    }
  }

  componentDidMount() {
    
  }

  render() {
    const { showContent } = this.state
    return (
      <React.Fragment>
        { showContent && this.props.children }
        { !showContent && <h3>Redirecting...</h3> }
      </React.Fragment>
    );
  }
}

// Redux

const mapStateToProps = ({ authReducer }) => {
  const loading = authReducer.loading;
  const config = authReducer.config;
  return { loading, config };
};

export default connect(mapStateToProps, {
  getOAuth2Config,
})(SessionChecker);
