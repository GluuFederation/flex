export default function() {
  return [
    {
      title: "sidemenu.dashboard",
      items: [
        {
          title: "sidemenu.home",
          to: "/home",
          htmlBefore: '<i class="material-icons">dashboard</i>',
          htmlAfter: ""
        }
      ]
    },
    {
      title: "sidemenu.identities",
      items: [
        {
          title: "sidemenu.groups",
          to: "/groups",
          htmlBefore: '<i class="material-icons">people</i>',
          htmlAfter: ""
        },
        {
          title: "sidemenu.users",
          to: "/users",
          htmlBefore: '<i class="material-icons">supervised_user_circle</i>',
          htmlAfter: ""
        },
        {
          title: "sidemenu.attributes",
          to: "/attributes",
          htmlBefore: '<i class="material-icons">gavel</i>',
          htmlAfter: ""
        }
      ]
    },
    {
      title: "SSO",
      items: [
        {
          title: "sidemenu.openid_connect",
          htmlBefore: '<i class="material-icons">control_camera</i>',
          open: false,
          items: [
            {
              title: "sidemenu.scopes",
              to: "/openid_scopes"
            },
            {
              title: "sidemenu.clients",
              to: "/openid_clients"
            },
            {
              title: "sidemenu.sectors",
              to: "/openid_sector_identifiers"
            }
          ]
        },
        {
          title: "sidemenu.saml",
          htmlBefore: '<i class="material-icons">all_inclusive</i>',
          open: false,
          items: [
            {
              title: "sidemenu.trusts",
              to: "/saml_trusts"
            },
            {
              title: "sidemenu.acrs",
              to: "/saml_acrs"
            },
            {
              title: "sidemenu.namedId",
              to: "/saml_namedid"
            }
          ]
        },
        {
          title: "sidemenu.uma",
          htmlBefore: '<i class="material-icons">polymer</i>',
          open: false,
          items: [
            {
              title: "sidemenu.scopes",
              to: "/uma_scopes"
            },
            {
              title: "sidemenu.resources",
              to: "/uma_ressources"
            }
          ]
        },
        {
          title: "sidemenu.passport",
          htmlBefore: '<i class="material-icons">credit_card</i>',
          open: false,
          items: [
            {
              title: "sidemenu.providers",
              to: "/passport_providers"
            },
            {
              title: "sidemenu.basic_config",
              to: "/passport_config"
            },
            {
              title: "sidemenu.idp_initiated",
              to: "/passport_idpflow"
            }
          ]
        }
      ]
    },
    {
      title: "sidemenu.extra",
      items: [
        {
          title: "sidemenu.server_status",
          to: "/server_status",
          htmlBefore: '<i class="material-icons">settings_input_hdmi</i>',
          htmlAfter: ""
        },
        {
          title: "sidemenu.view_logs",
          to: "/logs",
          htmlBefore: '<i class="material-icons">attach_file</i>',
          htmlAfter: ""
        },
        {
          title: "sidemenu.certificates",
          to: "/certificates",
          htmlBefore: '<i class="material-icons">new_releases</i>',
          htmlAfter: ""
        }
      ]
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Organization",
          htmlBefore: '<i class="material-icons">account_balance</i>',
          open: false,
          items: [
            {
              title: "System",
              to: "/file-manager-list"
            },
            {
              title: "Smtp",
              to: "/file-manager-cards"
            },
            {
              title: "Settings",
              to: "/file-manager-cards"
            },
            {
              title: "Extra libraries",
              to: "/file-manager-cards"
            }
          ]
        },
        {
          title: "Authentication",
          htmlBefore: '<i class="material-icons">vpn_key</i>',
          open: false,
          items: [
            {
              title: "Default",
              to: "/user-profile"
            },
            {
              title: "SCIM",
              to: "/user-profile-lite"
            }
          ]
        },
        {
          title: "Registration",
          htmlBefore: '<i class="material-icons">how_to_reg</i>',
          open: false,
          items: [
            {
              title: "Default",
              to: "/user-profile"
            },
            {
              title: "SCIM",
              to: "/user-profile-lite"
            }
          ]
        },
        {
          title: "oxTrust Json",
          htmlBefore: '<i class="material-icons">control_camera</i>',
          open: false,
          items: [
            {
              title: "Default",
              to: "/user-profile"
            },
            {
              title: "SCIM",
              to: "/user-profile-lite"
            },
            {
              title: "Recaptcha",
              to: "/edit-user-profile"
            },
            {
              title: "API",
              to: "/login"
            }
          ]
        },
        {
          title: "oxAuth Json",
          htmlBefore: '<i class="material-icons">view_module</i>',
          open: false,
          items: [
            {
              title: "Basic",
              to: "/file-manager-list"
            },
            {
              title: "Fido2",
              to: "/file-manager-list"
            },
            {
              title: "Files - Cards View",
              to: "/file-manager-cards"
            }
          ]
        }
      ]
    },
    {
      title: "Settingts",
      items: [
        {
          title: "Close Menu",
          htmlBefore: '<i class="material-icons">fast_rewind</i>',
          to: "/icon"
        },
        {
          title: "Logout",
          htmlBefore: '<i class="material-icons">logout</i>',
          to: "/"
        }
      ]
    }
  ];
}
