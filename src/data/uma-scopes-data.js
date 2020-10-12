export default () => [
  {
    id: 1,
    name: "SCIM Access",
    action: "oxtrust-api-read"
  },
  {
    id: 2,
    name: "Passport Access",
    action: "https://gluu.gasmyr.com/oxauth/restv1/uma/scopes/scim_access"
  },
  {
    id: 3,
    name: "API Write Access",
    action: "https://gluu.gasmyr.com/oxauth/restv1/uma/scopes/passport_access"
  }
];
