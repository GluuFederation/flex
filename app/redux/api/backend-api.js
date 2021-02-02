import axios from "../api/axios";

const defaultScopes = [
  "https://jans.io/oauth/config/attributes.readonly",
  "https://jans.io/oauth/config/attributes.write",
  "https://jans.io/oauth/config/acrs.readonly",
  "https://jans.io/oauth/config/acrs.write",
  "https://jans.io/oauth/config/scripts.write",
  "https://jans.io/oauth/config/scripts.readonly",
  "https://jans.io/oauth/config/smtp.readonly",
  "https://jans.io/oauth/config/smtp.write",
  "https://jans.io/oauth/config/logging.readonly",
  "https://jans.io/oauth/config/logging.write",
  "https://jans.io/oauth/config/openid/clients.readonly",
  "https://jans.io/oauth/config/openid/clients.write",
  "https://jans.io/oauth/config/uma/resources.readonly",
  "https://jans.io/oauth/config/uma/resources.write",
  "https://jans.io/oauth/config/scopes.readonly",
  "https://jans.io/oauth/config/scopes.write"
];

// Get OAuth2 Configuration
export const fetchServerConfiguration = async () => {
  return await axios
    .get("/oauth2/config")
    .then(response => response.data)
    .catch(error => {
      console.error(
        "Problems getting OAuth2 configuration in order to process authz code flow.",
        error
      );
      return error;
    });
};

// Retrieve user information
export const fetchUserInformation = async code => {
  return await axios
    .post("/oauth2/user-info", {
      code: code
    })
    .then(response => response.data)
    .catch(error => {
      console.error(
        "Problems fetching user information with the provided code.",
        error
      );
      return error;
    });
};

// Get API Access Token
export const fetchApiAccessToken = async () => {
  return await axios
    .post("/oauth2/api-protection-token", { scope: defaultScopes })
    .then(response => response.data)
    .catch(error => {
      console.error(
        "Problems getting API access token in order to process api calls.",
        error
      );
      return error;
    });
};
